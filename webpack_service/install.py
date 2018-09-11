import argparse as ConsoleArguments
import os as OS
import sys as System
import re as RegularExpressions
import subprocess as Worker
import crontab as Crontab
import getpass as Users

#IsAdmin = False
IllegalCharacters = RegularExpressions.compile('[^a-z_]')
CronCommand = '/usr/bin/python3 {ProjectDir}.updater.py'
ActiveServices = []

def errorAndQuit(Msg):
    print(Msg, file=System.stderr)
    print('The program will halt.')
    OS._exit(0)

def readFile(FileName):
    Return = ''
    with open(FileName, 'r') as File:
        Return = File.read()
    return Return

def writeFile(FileName, Input):
    with open(FileName, 'w') as File:
        File.write(Input)

def exec(Command):
     Process = Worker.Popen(
         Command,
         stdout=Worker.PIPE,
         stderr=Worker.PIPE
     )
     return Process.communicate()

def changeCron(Command, Duration, Name, Crontab, Job=None):
    if not Job:
        Job = Crontab.new(command=Command)

    Job.set_comment('Autopull of {}'.format(Name))
    Job.setall(Duration)
    if False is Job.is_valid():
        errorAndQuit('Cannot apply new job to crontab.')
    Crontab.write()

class ValidateDir(ConsoleArguments.Action):
    def __init__(self, option_strings, dest, nargs=None, **kwargs):
        if nargs is not None:
            raise ValueError("nargs not allowed")
        super(ValidateDir, self).__init__( option_strings, dest, **kwargs)

    def __call__(self, Parser, Namespace, Values, Options=None):
        if not Values or not isinstance(Values, str):
            errorAndQuit('Illegal input.')

        if not OS.path.isdir(Values):
            errorAndQuit('The given path {} does not exists.'.format(Values))

        setattr(Namespace, self.dest, OS.path.abspath(Values))

class ValidateServiceName(ConsoleArguments.Action):
    def __init__(self, option_strings, dest, nargs=None, **kwargs):
        if nargs is not None:
            raise ValueError("nargs not allowed")
        super(ValidateServiceName, self).__init__(option_strings, dest, **kwargs)

    def __call__(self, Parser, Namespace, Values, Options=None):
        Values = Values.strip()
        if not Values or not isinstance(Values, str):
            errorAndQuit('Illegal input.')
        else:
            if IllegalCharacters.match(Values):
                errorAndQuit('Illegal character in servicename found - only a-z,_ are allowed.')

            if Values in ActiveServices:
                errorAndQuit('The given servicename is allready in use.')

            setattr(Namespace, self.dest, Values)

class ValidateUpdateDuration(ConsoleArguments.Action):
    def __init__(self, option_strings, dest, nargs=None, **kwargs):
        if nargs is not None:
            raise ValueError("nargs not allowed")
        super(ValidateUpdateDuration, self).__init__(option_strings, dest,  **kwargs)

    def __isValid(self, Value):
        Index=0
        Return = 0

        if 1 is len(Value) and '*' == Value:
            return 3

        while True:
            if Index is len(Value):
                return 0

            if 48 > ord(Value[Index]):
                break
            if 57 < ord(Value[Index]):
                return -1

            Index += 1

        if 0 is Index and '\\' == Value(Index):
            Return = 1
        elif 0 < Index and '-' == Value(Index):
            Return = 2
        else:
            return -1

        Index += 1

        while True:
            if Index is len(Value):
                return Return

            if 48 > ord(Value[Index]) or 57 < ord(Value[Index]):
                return -1

    def __call__(self, Parser, Namespace, Values, Options=None):
        Values = Values.lstrip('@')
        DurationStrings = [
                    'reboot',
                    'yearly',
                    'monthly',
                    'midnight',
                    'weekly',
                    'dayly',
                    'hourly'
        ]

        DurationShortStrings = [
            'r',
            'y',
            'mon',
            'mid',
            'w',
            'd',
            'h'
        ]

        if Values in DurationStrings:
            Duration = '@' + Values
        elif Values in DurationShortStrings:
            Duration = '@' + DurationStrings[DurationShortStrings.index(Values)]
        elif 'minutely' == Values or 'min' == Values:
            Duration = '* * * * *'
        else:
            Colums = Values.split(':')

            if 5 != len(Colums):
                errorAndQuit('The given cron duration was in a invalid format.')

            for Index in range(0, len(Colums)):
                Type = self.__isValid(Colums[Index])

                if -1 is Type:
                    errorAndQuit('The given cron duration was in a invalid format.')

                if 2 is Type:
                    Colums[Index] = '*' + Colums[Index]

            Duration = ''.join( Colums )

        setattr(Namespace, self.dest, Duration)

Parser = ConsoleArguments.ArgumentParser()
Parser.add_argument('-p', '--project-directory',
                    required=True,
                    help='the base directory of the webpack application.',
                    action=ValidateDir
)
Parser.add_argument('-c', '--command',
                    help='the npm command to run the webpack application. The default value is \'dev\'.',
                    default='dev',
                    type=str
)
Parser.add_argument('-s', '--service-name',
                    help='how the systemd service should named.',
                    type=str,
                    action=ValidateServiceName,
                    required=True
)
Parser.add_argument('-i', '--install-directory',
                    help='where the install templates are located.',
                    action=ValidateDir,
                    type=str
)
Parser.add_argument('-n', '--no-updater',
                    help='the update script will not installed',
                    action='store_true',
                    default=False
)
Parser.add_argument('-d', '--update-duration',
                    help='how often the update script is supposed to run.\n'+\
                    'More information see at cron manual by using \'man cron\' in a terminal.\n' +\
                    'Also you can use shortcuts by using the first letter (or first 3 letters, when it is ambiguous).\n' +\
                    'The default is weekly',
                    default='@weekly',
                    action=ValidateUpdateDuration
)

try:
    IsAdmin = 0 == OS.getuid()
except AttributeError:
#    Parser.print_help()
    errorAndQuit('You run not under linux.')

#if False is IsAdmin:
#    Parser.print_help()
#    errorAndQuit('You need admin rights to run this script.')

Stdout, Stderr = exec(['systemctl', 'list-unit-files'])

if Stderr:
    errorAndQuit('Fatal error - I cannot read the active services.')

Stdout = Stdout.decode('utf-8').split('\n')
for Line in Stdout:
    Entry = Line.split(' ')[0]
    if Entry.endswith('.service'):
        ActiveServices.append(Entry)

Arguments = Parser.parse_args()

if Arguments.install_directory:
    ScriptDir = Arguments.install_directory
else:
    ScriptDir = OS.path.abspath('./')

ScriptDir = ScriptDir.rstrip(OS.sep)
ProjectDir = Arguments.project_directory.rstrip(OS.sep)

if not OS.path.isfile(ScriptDir + OS.sep + 'systemd_template'):
    errorAndQuit('Unable to find service template for systemd.')

SystemdFile = readFile(ScriptDir + OS.sep + 'systemd_template')

if not SystemdFile:
    errorAndQuit('Unable to find service template for systemd.')

if not Arguments.no_updater:

    if not OS.path.isfile(ScriptDir + OS.sep + 'updater_template'):
        errorAndQuit('Unable to find service template for systemd.')
    UpdaterFile = readFile(ScriptDir + OS.sep + 'updater_template')
    writeFile(
        ProjectDir + OS.sep + '.updater.py',
        UpdaterFile.format(
            ProjectDir=ProjectDir,
            ServiceName=Arguments.service_name,
            LogFile=ProjectDir + OS.sep + '.gitautopull.log' )
    )

    Updater = Crontab.CronTab(user=Users.getuser())
    for Job in Updater:
        if -1 is not str(Job).find('/usr/bin/python3 ' + ProjectDir + OS.sep + '.updater.py'):
            changeCron(
                Command=CronCommand.format(ProjectDir=ProjectDir + OS.sep),
                Duration=Arguments.update_duration,
                Name=ProjectDir,
                Crontab=Updater,
                Job=Job
            )
            break
    else:
        # add Updater to gitignore
        if not OS.path.isfile(ProjectDir + OS.sep + '.gitignore'):
            writeFile(ProjectDir + OS.sep + '.gitignore', '.updater.py\n.gitautopull.log')
        else:
            with open(ProjectDir + OS.sep + '.gitignore', 'a') as Ignore:
                Ignore.write('\n.updater.py\n.gitautopull.log')
        changeCron(
            Command=CronCommand.format(ProjectDir=ProjectDir + OS.sep),
            Duration=Arguments.update_duration,
            Name=ProjectDir,
            Crontab=Updater
        )

SystemdFile = SystemdFile.format(PathToProject=ProjectDir, Command=Arguments.command)

writeFile(ScriptDir + OS.sep + 'systemdfile', SystemdFile)

if False is IsAdmin:
    Stdout, Stderr = exec([
        'sudo',
        'mv',
        ScriptDir + OS.sep + 'systemdfile',
        '/lib/systemd/system/' + Arguments.service_name + '.service'
    ])
    Stdout, Stderr = exec(['sudo', 'systemctl', 'daemon-reload'])
    if Stderr:
        errorAndQuit(Stderr.decode('utf-8').strip())

    Stdout, Stderr = exec(['sudo', 'systemctl', 'reset-failed'])
    if Stderr:
        errorAndQuit(Stderr.decode('utf-8').strip())
else:
    Stdout, Stderr = exec([
        'mv',
        ScriptDir + OS.sep + 'systemdfile',
        '/lib/systemd/system/' + Arguments.service + '.service'
    ])
    Stdout, Stderr = exec(['systemctl', 'daemon-reload'])

    if Stderr:
        errorAndQuit(Stderr.decode('utf-8').strip())

    Stdout, Stderr = exec(['systemctl', 'reset-failed'])
    if Stderr:
        errorAndQuit(Stderr.decode('utf-8').strip())

Stdout, Stderr = exec(['systemctl', 'start',  Arguments.service_name])
if Stderr:
    print(Stderr.decode('utf-8').strip(), file=System.stderr)
else:
    print(Stdout.decode('utf-8'))
