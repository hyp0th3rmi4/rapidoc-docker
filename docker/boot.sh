#!/bin/sh

# This script perform a set of environment variable replacements
# to customise the configuration of the RapiDoc application and
# prepare the server to support multiple APIs.


# The script can be invoked with an argument which represents the
# name of the prefix of the names of the environment variables that
# will be considered for the substitution. If there is no prefix
# defined, it will use the default prefix TMPL_

# Checking for the script argument and defaulting to TMPL_
#
S_LIST_PREFIX=${1:-TMPL_}
S_RAPIDOC_TEMPLATE=${2:-/opt/app/index.html.template}
S_RAPIDOC_DEFAULTS=${3:-/opt/app/defaults.env}
S_RAPIDOC_ROOT=/usr/share/nginx/html
S_RAPIDOC_HTML=${S_RAPIDOC_ROOT}/index.html
S_SPECS_ROOT=${S_RAPIDOC_ROOT}/specs

# This function creates the list of environment variables that will be used for the substitution.
# It collects all the environment variables that have a specified prefix and creates another
# environment variable that presents them in a comma separated list (S_LIST).
#
function create_substitution_list() {
  
  # This is pretty hard stuff, let me explain it.
  # 1. env: we list all the environment variables
  # 2. grep "^${PREFIX}*": we filter out all the variables that do not match the given prefix
  # 3. sed 's/=.*//': we remove whatever comes after and including =
  # 4. sed 's/^/$/': we prefix the remaining content with $
  # 5. tr '\n' ',': we remove new-line characters and replace them with comma
  # 6. sed 's/.$//': we remove the last character (which would be a comma)
  #
  export S_LIST=$(env | grep "^${S_LIST_PREFIX}*" | sed 's/=.*//' | sed 's/^/$/' | tr '\n' ',' | sed 's/.$//')

}

# This function is used to dump the content of a file into the console for
# the purpose of debugging the outcome of a substitution. It accepts one
# argument that is the path to th file to show.
#
function show_content {

    echo ""
    echo "[BEGIN: $1]"

    cat $1

    echo "[END: $1]"
    echo ""
}

echo "0. Initialising ..."
echo "   - Prefix             : ${S_LIST_PREFIX}"
echo "   - Template           : ${S_RAPIDOC_TEMPLATE}"
echo "   - Defaults           : ${S_RAPIDOC_DEFAULTS}"
source ${S_RAPIDOC_DEFAULTS}
echo ""

echo "2. Processing HTML index file .."

    create_substitution_list

    echo "     - Substitution List  : $S_LIST"

    if [ "${S_LIST}" == "" ]; then
      echo "     - [WARN] Substitution list is empty, skipping  substitution."
      echo "     - cp ${S_RAPIDOC_TEMPLATE} ${S_RAPIDOC_HTML}"
      cp ${S_RAPIDOC_TEMPLATE} ${S_RAPIDOC_HTML}   

    else

      echo "     - envsubst ${S_LIST} < ${S_RAPIDOC_TEMPLATE} > ${S_RAPIDOC_HTML}"
      envsubst ${S_LIST} < ${S_RAPIDOC_TEMPLATE} > ${S_RAPIDOC_HTML}
    fi

    if [ "${S_DEBUG}" == "-d" ]; then
  
      show_content ${S_RAPIDOC_HTML}
    fi



echo ""


echo "3. Yelding Control to NginX"

nginx -g "daemon off;"



