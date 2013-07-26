var model = { 
    wave : {
        scriptName: '',
        startWhen: '',
        startOn: '',
        whenFinished: '',
        
        startPriority: {
          options: [0, 1],
          desc: ['Enemies are dead', 'Timer finishes'],
          value: 0
        },

        layerName: {
          options: [],
          value: null
        },

        enemies: {
          leader: {
            className: {
              options: [],
              value: null
            },
            weapons: [{
              className: {
                options: [],
                value: null
              },
              firingRate: '',
              firingDirType: {
                options: [0, 1],
                desc: [],
                value: 0
              },
              firingAngle: ''
            }]
          },
          followers: [{
            className: {
              options: [],
              value: null
            },            
            trailing: '',
            offset: {
              x: '',
              y: ''
            },
            weapons: [{
              className: {
                options: [],
                value: null
              },
              firingRate: '',
              firingDirType: {
                options: [0, 1],
                desc: ['Static direction', 'At player'],
                value: 0
              },
              firingAngle: ''
            }]            
          }]
        },
        script: {
          directives: [{
            starting: {
              min: 0,
              max: 1,
              step: 0.1,
              value: 0
            },
            speed: '',
            waitTime: ''
          }]
        }
      }
  }