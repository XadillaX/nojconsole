nojconsole
==========

The console submitter for NBUT Online Judge System.

How to Use?
-----------

Open your console and type in `vim nojsub.sh`.

Find these two lines:

    USERNAME=""
    PASSWORD=""

Type in the account information of yourself and exit **vim**.

Read a problem via http://acm.nbut.edu.cn/ and code it.

Run the command:

    sh nojsub -l LANG -i PROBID -f FILENAME

> You should know that ***LANG*** is the language of your code. NOJ now is only support for gcc, g++ and fpc.
>
> ***PROBID*** is the number of that problem.
>
> ***FILENAME*** is the filename of your code file.

After a few moment, you can get the result.
