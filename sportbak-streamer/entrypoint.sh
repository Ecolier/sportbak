#!/bin/bash
set -e

command="$@"

case $1 in
	webservice)
		echo "Running production mode ..."
		command="python3 -m videoapp.main"
		;;
        emulator)
                echo "Running camera emulator ..."
                command="python3 -m videoapp.emulator"
                ;;
	tests)
		echo "Running tests ..."
		pytest tests videoapp
		exit
		;;		
esac

exec $command 
