
let mock = {}                           // Container for mock data

let Bireader = {
    data: undefined,                    // defined later on
    fsm : undefined,                    // defined later on
    section: {                          // defined later on
        main        : undefined,
        translation : undefined,
        controls    : undefined,
    },
    view: () => {
        return m('div',[
            Bireader.section.main(),
            m('footer',[
                Bireader.section.translation(),
                Bireader.section.controls(),
            ]),
        ])
    }
}

// Data
Bireader.data_init = () => {
    return {
        segmentList:  mock.data_segmentList(),
        currIdx : -1,
        currMode:  1,        // One of: 1 (auto) | 0 (manual)
    }
}

// FSM
Bireader.fsm_mach = () => {
    return {                                    // Define the FSM
        states: {
            init: {
                on: {
                    READY: 'start'
                }
            },
            start: {
                on: {
                    FIRST: 'auto_play'
                }
            },
            auto_play: {                        // Auto-play mode
                on: {
                    PAUSE : 'paused_auto',      // pause auto-play mode
                    NEXT  : 'auto_play',        // auto play next segment
                    PREV  : 'auto_play',        // auto play prev segment
                    MODE  : 'manual_play',      // Change to manual play mode
                    END   : 'ended',
                }
            },
            paused_auto: {                      // Paused auto play
                on: {
                    RESUME: 'auto_play',        // resume auto-play mode
                    NEXT  : 'auto_play',        // auto play next segment
                    PREV  : 'auto_play',        // auto play prev segment
                    MODE  : 'paused_manual',    // Change to manual pause mode
                }
            },
            manual_play: {                      // Manual play mode
                on: {
                    PAUSE : 'paused_manual',    // pause manual play mode
                    NEXT  : 'manual_play',      // manual play next segment
                    PREV  : 'manual_play',      // manual play prev segment
                    MODE  : 'auto_play',        // Change to auto play mode
                    END   : 'ended',
                }
            },
            paused_manual: {
                on: {
                    RESUME: 'manual_play',      // resume manual-play mode
                    NEXT  : 'manual_play',      // manual play next segment
                    PREV  : 'manual_play',      // manual play prev segment
                    MODE  : 'paused_auto',      // Change to auto pause mode
                }
            },
            ended: {
                on: {
                    FIRST: 'auto_play'
                }
            },
        },
    }
}
Bireader.fsm_handle = (evt,data) => {
    // Set of evt
    //   One of: READY | FIRST
    //           | PAUSE  | RESUME
    //           | NEXT   | PREV
    //           | MODE
    let state = Bireader.fsm.state
    // console.log('fsm: '+state+' + '+evt)

    let next  = Bireader.fsm.m.states[state].on[evt]
    console.log('fsm: '+state+' + '+evt+' -> '+next)

    Bireader.fsm.state = next

    Bireader.fsm.dispatch[next](evt,data)        // Call the handler
}
Bireader.fsm_dispatch = () => {
    return {
        init         : Bireader.fsm_onState_init,
        start        : Bireader.fsm_onState_start,
        auto_play    : Bireader.fsm_onState_auto_play,
        paused_auto  : Bireader.fsm_onState_paused_auto,
        paused_manual: Bireader.fsm_onState_paused_manual,
        manual_play  : Bireader.fsm_onState_manual_play,
        ended        : Bireader.fsm_onState_ended,
    }
}
Bireader.fsm_onState_start = (evt,data) => {
    Bireader.data.currMode = 1,
    Bireader.data.currIdx  = 0,
    console.log('starting in 3, 2, 1 seconds ... ')
    // Bireader.fsm.handle('FIRST')
}
Bireader.fsm_onState_auto_play = (evt,data) => {
    // Auto play the current segment
    // At the end of it, check whether the next segment exists
    //   If exist, auto-play the next segment
    //   Else, stop
    console.log(evt,data)

    if (evt === 'FIRST') {
        Bireader.data.currIdx = 0
    } else if (evt === 'NEXT') {
        Bireader.data.currIdx++
    } else if (evt === 'PREV') {
        Bireader.data.currIdx--
    } else {    // RESUME, MODE
        Bireader.data.currMode = 1
    }

    m.redraw()


    // Setup the audioNow tag and play it
    let now = document.getElementById('audioNow')
    now.onended = () => {
        // Check whether next segment exists
        let j = Bireader.data.currIdx + 1
        console.log(j , Bireader.data.segmentList.length-1)
        if (j <= Bireader.data.segmentList.length-1) {
            Bireader.fsm.handle('NEXT')
        } else {
            Bireader.fsm.handle('END')
        }
    }
    now.src = 'audio/'+Bireader.data.currIdx+'.mp3'
    now.play()
    .then(res => {
        console.log('Playing segment:' + Bireader.data.currIdx)
    })

}
Bireader.fsm_onState_manual_play = (evt,data) => {
    // Manual play the current segment
    // At the end of it, stop
    console.log(evt,data)

    if (evt === 'FIRST') {
        Bireader.data.currIdx = 0
    } else if (evt === 'NEXT') {
        Bireader.data.currIdx++
    } else if (evt === 'PREV') {
        Bireader.data.currIdx--
    } else {    // RESUME, MODE
        Bireader.data.currMode = 0
    }

    m.redraw()

    // Setup the audioNow tag and play it
    let now = document.getElementById('audioNow')
    now.src = 'audio/'+Bireader.data.currIdx+'.mp3'
    now.onended = undefined
    now.play()
    .then(res => {
        console.log('Playing segment:' + Bireader.data.currIdx)
    })

}
Bireader.fsm_onState_paused_auto = (evt,data) => {
    let now = document.getElementById('audioNow')
    now.pause()
    console.log('Paused auto play')
}
Bireader.fsm_onState_ended = (evt,data) => {
    console.log('ended')
    m.redraw()
}


// Section Views
Bireader.section.main = () => {
    return m('div',Bireader.data.segmentList.map(s => {
        let pointed = s.id === Bireader.data.currIdx ? '.pointed' : ''
        return m('span.'+s.type+pointed,
                 s.text+' ')
    }))
}
Bireader.section.translation = () => {
    // Guard show nothing if no segment selected
    if (Bireader.data.currIdx < 0) { return }
    return m('div.dark-gray.bg-washed-red',
             Bireader.data.segmentList[Bireader.data.currIdx].tran)
}
Bireader.section.controls = () => {
    let mode = () => {
        if (Bireader.data.currMode) {
            return m('span',
                     {onclick:()=>{Bireader.fsm.handle('MODE')}}
                     ,'[A]')
        } else {
            return m('span',
                     {onclick:()=>{Bireader.fsm.handle('MODE')}}
                     ,'[M]')
        }
    }

    // Guard: Show Start button on startup
    if (Bireader.fsm.state === 'start') {
        return m('div.red',
                 {onclick:() => {Bireader.fsm.handle('FIRST')}},
                 'START')
    } else if (Bireader.fsm.state === 'ended') {
        return m('div.red',
                 {onclick:() => {Bireader.fsm.handle('FIRST')}},
                 'AGAIN')
    }

    let can = msg => {
        let s = Bireader.fsm.state
        return typeof(Bireader.fsm.m.states[s].on[msg]) !== "undefined"
    }
    let canPrev = () => {
        return can('PREV') && (Bireader.data.currIdx > 0)
    }
    let canNext = () => {
        return can('NEXT')
               && (Bireader.data.currIdx < Bireader.data.segmentList.length-1)
    }
    let onPause = () => { can('PAUSE')  && Bireader.fsm.handle('PAUSE') }
    let onPlay  = () => { can('RESUME') && Bireader.fsm.handle('RESUME') }
    let onPrev  = () => { canPrev() && Bireader.fsm.handle('PREV') }
    let onNext  = () => { canNext() && Bireader.fsm.handle('NEXT') }
    let onMode  = () => { can('MODE') && Bireader.fsm.handle('MODE') }

    let click = ".dark-blue"

    return m('div',[
        // mode(),
        m('span'+(can('MODE')&&click),{onclick:onMode},
            Bireader.data.currMode ? '(A)' : '(M)' ),

        m('span.mh1.f7','\u00b7'),
        m('span'+(can('RESUME')&&click),{onclick:onPlay},'Play'),

        m('span.mh1.f7','\u00b7'),
        m('span'+(can('PAUSE')&&click),{onclick:onPause},'Pause'),

        m('span.mh1.f7','\u00b7'),
        m('span'+(canPrev()&&click),{onclick:onPrev},'Prev'),

        m('span.mh1.f7','\u00b7'),
        m('span'+(canNext()&&click),{onclick:onNext},'Next'),
    ])
}


// Mock Data
mock.data_segmentList = () => {
    return [
        {   id: 0,
            type: 'chapter-title',
            text: 'Ali Baba and The Forty Thieves',
            tran: 'Ali Baba และสี่สิบหัวขโมย',
        },
        {   id: 1,
            type: 'paragraph-start',
            text: 'In a town in Persia lived two brothers named Cassim and Ali Baba,',
            tran: 'ในเมืองในเปอร์เซียมีพี่ชายสองคนชื่อ Cassim และ Ali Baba',
        },
        {   id: 2,
            type: '',
            text: 'between whom their father at his death had left what little property he possessed equally divided.',
            tran: 'ซึ่งพ่อของพวกเขาเสียชีวิตได้ทิ้งทรัพย์สินเล็ก ๆ น้อย ๆ ที่เขามีไว้แบ่งเท่า ๆ กัน',
        },
    ]
}


// Setup before start
Bireader.data = Bireader.data_init()
Bireader.fsm = {
    m       : Bireader.fsm_mach(),
    handle  : Bireader.fsm_handle,
    state   : 'start',
    dispatch: Bireader.fsm_dispatch(),
}
// Bireader.fsm.handle('READY');   // Start the FSM

