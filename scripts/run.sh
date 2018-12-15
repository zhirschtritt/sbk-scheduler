#!/bin/bash
echo "all the bin: "
ls 

/oauth2/oauth2_proxy -config=/oauth2/oauth2_proxy.cfg &

npm start