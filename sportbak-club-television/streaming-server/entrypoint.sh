#!/bin/bash
set -e

command="$@"

case $1 in
	start)
		echo "Running production mode ..."
		command="python3 main.py"
		;;
	tests)
		echo "Running tests ..."
		pytest studio
		exit
		;;		
esac

echo "Running $command ..."
exec $command 
