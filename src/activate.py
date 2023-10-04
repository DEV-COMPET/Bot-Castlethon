import subprocess
import sys
import os

def partial_to_full_path(path=""):
    from pathlib import Path

    parent = Path(__file__).parent
    for _ in range(path.count('../')):
        parent = parent.parent
    parent = str(parent)

    barras = path.count('../') * '../'
    parent += path[path.find(barras) + len(barras) - 1:]
    return parent


def activate_virtual_environment():
    
    venv_path = partial_to_full_path("../dist/bot/utils/python/venv")
    
    print(venv_path)
    print(os.path.join(venv_path, 'bin', 'activate'))
    
    if sys.platform == 'win32': 
        activate_script = os.path.join(venv_path, 'Scripts', 'activate')
    else:
        print("Aqui")
        activate_script = os.path.join(venv_path, 'bin', 'activate')

    # Use the "source" command to activate the virtual environment
    activate_command = f'source {activate_script}'
    
    print("Executando " + activate_command)
    
    try:
        os.system(activate_command)
        # subprocess.run(activate_command, shell=True, check=True)
        print(f'Virtual environment activated: {venv_path}')
    except:
        print('Failed to activate virtual environment.')
    
activate_virtual_environment()