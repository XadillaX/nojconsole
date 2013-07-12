#!/bin/bash
# NBUT OJ console submitter.

USERNAME=""
PASSWORD=""
LANGUAGE="gcc"
PROBID="1000"
FILENAME="code.c"
ROOTPATH="${0%/*}"

while getopts "f:l:i:" arg
do
    case $arg in
        f)
            #echo "Filename: $OPTARG"
            FILENAME=$OPTARG
            ;;
        l)
            LANGUAGE=$OPTARG
            #case $OPTARG in
            #    gcc)
            #        echo "Language: C";;
            #    g++)
            #        echo "Language: C++";;
            #    fpc)
            #        echo "Language: Pascal";;
            #    *)
            #        echo "Language: C";;
            #esac
            ;;
        i)
            #echo "ProblemID: $OPTARG"
            PROBID=$OPTARG
            ;;
        *)
            ;;
    esac
done

node $ROOTPATH/nbutoj-submitter.js -u "$USERNAME" -p "$PASSWORD" -l $LANGUAGE -i $PROBID -f "$FILENAME"
