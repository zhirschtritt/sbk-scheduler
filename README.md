# sbk-schedule

Production build deployed at [schedule.somervillebikekitchen.org](https://schedule.somervillebikekitchen.org) 🙌

## About

Built for the somervillebikekitchen, a volunteer-run bike repair space in Davis Square, Somerville, MA. 

Features: 
- Needlessly real-time using [featherjs](https://feathersjs.com/) and websocket.io
- [Vue](https://vuejs.org/) / [Vuex](https://vuex.vuejs.org/) / [Vuetify](https://vuetifyjs.com) clientside trifecta 
- Also using the ridiculously awesome [feathers-vuex](https://feathers-plus.github.io/v1/feathers-vuex/)
- Deployed via [now.sh](https://now.sh)

## Developing

1. Make sure you have [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
2. Install your dependencies

    ```
    cd path/to/sbk-schedule/server; npm install
    cd path/to/sbk-schedule/client; npm install
    ```

3. Start server and client separately 

    ```
    cd path/to/sbk-schedule/server; npm start
    cd path/to/sbk-schedule/client; npm start
    ```

## Deploying

Deployed via multi-stage Dockerfile in root directory. 

1. TODO: deploy via CI.
2. Currently: 
    ```
    cd path/to/sbk-schedule; now --public
    now alias <RANDOM URL> <URL YOU WANT>
    ```

## Scaffolding Feathers Server

Feathers has a powerful command line interface. Here are a few things it can do:

```
$ npm install -g @feathersjs/cli          # Install Feathers CLI

$ feathers generate service               # Generate a new Service
$ feathers generate hook                  # Generate a new Hook
$ feathers generate model                 # Generate a new Model
$ feathers help                           # Show all commands
```

## License

Copyright (c) 2018

Licensed under the [MIT license](LICENSE).
