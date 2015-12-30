#!/bin/bash

echo "TeaMeeting quick setup"

echo "Installing node modules..."
sudo npm install underscore crypto redis mysql nodemailer@0.7.1 jpush-sdk

echo "You're all set! Make sure you have prepared the database as described in schema"


