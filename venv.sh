#!/bin/bash

backend_dir="$(pwd)/backend"
venv_path="$backend_dir/venv"

# create venv if not exists
if [[ ! -d "$venv_path" ]]; then
    echo "creating venv at $venv_path"
    python -m venv "$venv_path"
else
    echo "venv already created at $venv_path"
fi

# source venv if not sourced
if [[ -z "$VIRTUAL_ENV" ]]; then
    echo "sourcing venv at $venv_path"
    source "$venv_path/bin/activate"
    echo "run deactivate to deactivate"
else
    echo "venv already sourced at $venv_path"
    echo "run deactivate to deactivate"
fi