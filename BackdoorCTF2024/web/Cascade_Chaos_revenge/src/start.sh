#!/bin/bash

SECRET_TOKEN=$(head -c 32 /dev/urandom | xxd -p -c 32)
FLAG=flag{dummy_flag}

echo "SECRET_TOKEN=$SECRET_TOKEN" > .env
echo "FLAG=$FLAG" >> .env

docker-compose up --build