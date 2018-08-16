"""
"
"""
import subprocess as Worker
import sys as System
import os as OS

# configurable variables
TrackedFiles = [
    './index.html',
    'src/main.js',
    './package.json'
]

PostCommands = [
    ['npm', 'i'],
    ['touch', './src/App.vue']
]

Branch = 'master'
Encoding = 'utf-8'
WorkingDir = './'

# predefinitions
# functions
def errorAndQuit(Msg):
    print(Msg, file=System.stderr)
    print('The program will stop')
    OS._exit(0)

def exec(Command):
     Process = Worker.Popen(
         Command,
         stdout=Worker.PIPE,
         stderr=Worker.PIPE
     )

     return Process.communicate()

def decodeAndSplit(BinaryString, Delimiter, Encoding):
    return BinaryString.decode(Encoding).split(Delimiter)

def splitCommit(BinaryString, Encoding):
    Commits = BinaryString.decode(Encoding).split('\n')
    Return = []
    for Index in range(0, len(Commits)):
        if\
            True is Commits[Index].startswith('commit ')\
        and\
            len(Commits) > Index\
        and\
            True is Commits[Index+1].startswith('Author: '):
            Return.append(Commits[Index].split(' ')[1].strip())
    return Return

# vars
Commits = []
FileChanges = []
RunPostCommands = False
# programstart
try:
    OS.chdir(WorkingDir)
except Exception as e:
    raise e

Stdout, Stderr = exec(['git', 'branch'])
if Stderr:
    errorAndQuit(Stderr.decode(Encoding))

Stdout = decodeAndSplit(Stdout, '*', Encoding)
ActiveBranch = Stdout[1].split('\n')[0].strip()

if not Branch == ActiveBranch:
    errorAndQuit('The updating branch is not the same like the current branch')

Stdout, Stderr = exec(
    ['git', 'log', '{branch}..origin/{branch}'.format(branch=Branch)]
)

if Stderr:
    errorAndQuit(Stderr.decode(Encoding))

if not Stdout:
    # noting changed
    OS._exit(0)

Commits = splitCommit(Stdout, Encoding)

Worker.run(['git', 'pull', '-f'])

for TrackedFile in TrackedFiles:
    FileChanges = []
    Stdout, Stderr = exec(['git', 'log', '--follow', TrackedFile])
    if Stderr:
        errorAndQuit(Stderr.decode(Encoding))
    Logs = splitCommit(Stdout, Encoding)
    Intersection = list(set(Commits) & set(Logs))
    if Intersection:
        RunPostCommands = True
        break

if True is RunPostCommands:
    for Command in PostCommands:
        Worker.run(Command)
