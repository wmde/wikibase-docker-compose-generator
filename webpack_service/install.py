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

Users = []
IsAdmin = False
IllegalCharacters = RegularExpressions.compile('[^a-z_-]')
IllegalCharactersUser = RegularExpressions.compile('[^a-z]')
CreateUser = False
BaseDir = '.'

Parser = ConsoleArguments.ArgumentParser()
Parser.add_argument('-d', '--base-directory',
                    help='The base directory from where the script is reading.')
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

ServiceFile = readFile(BaseDir + OS.sep + 'service_template')
SystemdFile = readFile(BaseDir + OS.sep + 'systemd_template')
ServiceDir = OS.path.abspath(OS.getcwd() + OS.sep + '..')

if not SystemdFile:
    errorAndQuit('Unable to find service template for systemd.')
if not ServiceFile:
    errorAndQuit('Unable to find service template for webpack.')

for User in UsersControl.getpwall():
    Users.append(User.pw_name)

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

