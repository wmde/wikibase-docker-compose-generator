import argparse as ConsoleArguments
import ctypes as CTypes
import os as OS
import sys as System
import pwd as UsersControl
import re as RegularExpressions
import subprocess as Worker

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

Users = []
IsAdmin = False
IllegalCharacters = RegularExpressions.compile('[^a-z_-]')
IllegalCharactersUser = RegularExpressions.compile('[^a-z]')
CreateUser = False
BaseDir = '.'
ActiveServices = []


class ValidateUpdateDuration(ConsoleArguments.Action):
    def __init__(self, Options, Destination, Args=None, **KWArgs):
        super(ValidateUpdateDuration, self).__init__(Options, Destination, **KWArgs)

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

            if 48 > ord(Value[Index]) or 57 < ord(Valuese[Index]):
                return -1

    def __call__(self, Parser, Namespace, Values, Options=None):
        Duration = ''
        DurationStrings = [
                    'yearly',
                    'monthly',
                    'midnight',
                    'weekly'
                    'dayly',
                    'hourly',
                    'reboot'
        ]

        DurationShortStrings = [
            'y',
            'mon',
            'mid',
            'w',
            'd',
            'h',
            'r'
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

            Values = ' '.join(Colums)

        setattr(Namespace, self.dest, Duration)

Parser = ConsoleArguments.ArgumentParser()
Parser.add_argument('-p', '--project-directory',
                    required=True,
                    help='the base directory from where the script is reading.')
Parser.add_argument('-u','--username',
                    help='the user, which is running the Service' + \
                    'The default user is called \'webpack\'.',
                    default='webpack',
                    type=str,
                    required=True
                    )
Parser.add_argument('-c', '--command',
                    help='if the given command differs' + \
                    'from the one for the webpack application. The default ' + \
                    'is \'run dev\'',
                    default='run dev',
                    type=str
                    )

Parser.add_argument('-a', '--add-user',
                    help='the program will add a new user, if the given user' +\
                    ' does not exists.',
                    default=False,
                    action='store_true'
                    )
Parser.add_argument('-s', '--service',
                    help='how the systemd service should named.',
                    type=str,
                    required=True
                    )
Parser.add_argument('-i', '--install-direcotry',
                    help='where the install scripts located.',
                    type=str
                    )
Parser.add_argument('-n', '--no-updater',
                    help='the update script will not installed',
                    action='store_false',
                    default=True
                    )
Parser.add_argument('-d', '--update-duration',
                    help='how often the update script is supposed to run.\n'+\
                    '' +\
                    '',
                    action=ValidateUpdateDuration
                    )


Arguments = Parser.parse_args()
if Arguments.base_directory:
    BaseDir = Arguments.base_directory

BaseDir = BaseDir.rstrip(OS.sep)

try:
    IsAdmin = 0 == OS.getuid()
except AttributeError:
    errorAndQuit('You run not under linux.')

if False is IsAdmin:
    errorAndQuit('You need admin rights to run this script.')


Stdout, Stderr = exec(['systemctl', 'list-unit-files'])

if Stderr:
    errorAndQuit('Fatal error - I cannot read the active services.')

Stdout = Stdout.split('\n')
for Line in Stdout:
    Entry = Line.split(' ')[0]
    if Entry.endswith('.service'):
        ActiveServices.append(Entry)

ServiceFile = readFile(BaseDir + OS.sep + 'service_template')
SystemdFile = readFile(BaseDir + OS.sep + 'systemd_template')
ServiceDir = OS.path.abspath(OS.getcwd() + OS.sep + '..')

if not SystemdFile:
    errorAndQuit('Unable to find service template for systemd.')
if not ServiceFile:
    errorAndQuit('Unable to find service template for webpack.')

for User in UsersControl.getpwall():
    Users.append(User.pw_name)


"""
while True:
    print('Please enter the username for webpack service (webpack is default):')
    Input = input().strip().lower()
    if not Input:
        Username = 'webpack'
        break
    else:
        if IllegalCharactersUser.match(Input):
            print('Illegal chracter found - only a-z are allowed.')
            continue

        Username = Input
        break

if not Username in Users:
    print('The given user does not exists - should a account created? (y/n[is default]):')
    Input = input().lower().strip()
    if not Input or 'y' != Input:
        errorAndQuit('Installer aborted.')
    else:
        CreateUser = True

while True:
    print('How should the service called:')
    Input = input().lower().strip()
    if not Input:
        errorAndQuit('Illegal input.')
    else:
        if IllegalCharacters.match(Input):
            print('Illegal chracter found - only a-z,_,- are allowed.')
            continue

        ServiceName = Input
        break

print('Is {serviceDir} the root dir of your webpack application? (y/n[is default]):'\
      .format(serviceDir=ServiceDir))

Input = input().strip()
if not Input or 'y' != Input.lower():
    while True:
        print('Where is webpack application located?:')
        Input = input().strip()
        if not Input:
            errorAndQuit('Illegal input.')
        else:
            if\
                    False is OS.path.isdir(Input)\
                or\
                    False is OS.path.isdir(Input + OS.sep + 'node_modules'):
                print('The given given was not found or is no nodejs folder.')
                continue
            else:
                ServiceDir = OS.path.abspath(Input)
                break

ServiceFile = ServiceFile.format(pathToProject=ServiceDir)
SystemdFile = SystemdFile.format(pathToProject=ServiceDir, username=Username)

writeFile(BaseDir + OS.sep + 'service.py', ServiceFile)
writeFile(BaseDir + OS.sep + 'systemdfile', SystemdFile)

Worker.run([
    'mv',
    BaseDir + OS.sep + 'systemdfile',
    '/lib/systemd/system/' + ServiceName + '.service'
])

Worker.run(['useradd', '-r', '-s', '/bin/false', Username])
Worker.run(['systemctl', 'daemon-reload'])
"""

# add update cron in crontab
Crontab = OS.popen('crontab -l > current_crontab.txt');
Crons = Crontab.read();
Crontab.close();
NewCrontab = file('current_crontab.txt', 'a');
#NewCrontab.write("\n### Comment here if you like");
#NewCrontab.write("\n* * * * * Put your command here");
NewCrontab.close();
# add gitignore
