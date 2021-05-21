
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
                    FIRST: 'play'
                }
            },
            play: {
                on: {
                    PAUSE : 'paused',      // pause play
                    NEXT  : 'play',        // play next segment
                    PREV  : 'play',        // play prev segment
                    END   : 'ended',       // no more segments
                }
            },
            paused: {
                on: {
                    RESUME: 'play',        // resume play
                    NEXT  : 'play',        // play next segment
                    PREV  : 'play',        // play prev segment
                }
            },
            ended: {
                on: {
                    FIRST: 'play'
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
    m.redraw()
}
Bireader.fsm_dispatch = () => {
    return {
        init         : Bireader.fsm_onState_init,
        start        : Bireader.fsm_onState_start,
        play         : Bireader.fsm_onState_play,
        paused       : Bireader.fsm_onState_paused,
        auto_play    : Bireader.fsm_onState_auto_play,
        paused_auto  : Bireader.fsm_onState_paused_auto,
        paused_manual: Bireader.fsm_onState_paused_manual,
        manual_play  : Bireader.fsm_onState_manual_play,
        ended        : Bireader.fsm_onState_ended,
    }
}
Bireader.fsm_onState_start = (evt,data) => {
    Bireader.data.currIdx  = 0,
    console.log('starting in 3, 2, 1 seconds ... ')
}
Bireader.fsm_onState_play = (evt,data) => {
    // Play the current segment
    // At the end of it, check whether the next segment exists
    //   If exist, check the mode
    //      If mode is AUTO, play NEXT segment
    //      If mode is MANUAL, PAUSE next segment
    //   If not exist, end
    console.log(evt,data)

    if (evt === 'FIRST') {
        Bireader.data.currIdx = 0
    } else if (evt === 'NEXT') {
        Bireader.data.currIdx++
    } else if (evt === 'PREV') {
        Bireader.data.currIdx--
    } else {    // RESUME, MODE
        // Bireader.data.currMode = 1
    }

    m.redraw()


    // Setup the audioNow tag and play it
    let now = document.getElementById('audioNow')
    now.onended = () => {
        // Check whether next segment exists
        let j = Bireader.data.currIdx + 1
        console.log(j , Bireader.data.segmentList.length-1)
        if (j <= Bireader.data.segmentList.length-1) {
            // If AUTO mode (1), send NEXT
            // if MANUAL mode (0), send PAUSE
            Bireader.fsm.handle(Bireader.data.currMode ? 'NEXT' : 'PAUSE')
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
Bireader.fsm_onState_paused = (evt,data) => {
    let now = document.getElementById('audioNow')
    now.pause()
    console.log('Paused audio play')
}
Bireader.fsm_onState_ended = (evt,data) => {
    console.log('ended')
    m.redraw()
}


// Section Views
Bireader.section.main = () => {
    let text = m('div',Bireader.data.segmentList.map(s => {
        let pointed = s.id === Bireader.data.currIdx ? '.pointed' : ''
        return m('span.'+s.type+pointed,
                 s.text+' ')
    }))
    let bottom = () => {
        if (typeof(Bireader.data.segmentList[Bireader.data.currIdx])
            === 'undefined') {
            return [
                m('div.white','trans'),
                m('div.white','controls'),
            ]
        } else {
            return [
                m('div.white',Bireader.data.segmentList[Bireader.data.currIdx].tran),
                m('div.white','controls'),
            ]
        }
    }
    return m('div',[
        text,
        bottom(),
    ])
}
Bireader.section.translation = () => {
    // Guard show nothing if no segment selected
    if (Bireader.data.currIdx < 0) { return }
    return m('div', [
        m('div.ph2.pt1.dark-gray.bg-lightest-blue',
             Bireader.data.segmentList[Bireader.data.currIdx].tran),
    ])
}
Bireader.section.controls = () => {
    let click = ".dark-blue"

    // Show Play button on startup
    if (Bireader.fsm.state === 'start') {
        return [
            m('i.fa.fa-home'+click,
                {onclick:() => window.location.href = '/index.html'}),
            m('span.mh3.white.f5','\u00b7'),
            m('span.dark-blue',
                {onclick:() => {Bireader.fsm.handle('FIRST')}},
                m('i.fa.fa-play')),
        ]

    // Show Repeat button on end
    } else if (Bireader.fsm.state === 'ended') {
        return [
            m('i.fa.fa-home'+click,
                {onclick:() => window.location.href = '/index.html'}),
            m('span.mh3.white.f5','\u00b7'),
            m('span.dark-blue',
                {onclick:() => {Bireader.fsm.handle('FIRST')}},
                m('i.fa.fa-repeat')),
        ]
    }

    let repeatIcon = () => {
        return m('span.dark-blue',
                 {onclick:() => {Bireader.fsm.handle('FIRST')}},
                 m('i.fa.fa-repeat'))
    }
    let modeIcon = () => {
        return m('span',[
            m('span'+click,{onclick:onMode},
                Bireader.data.currMode ? m('i.fa.fa-bullseye')
                                       : m('i.fa.fa-hand-paper-o')),
        ])
    }

    let can = msg => {
        let s = Bireader.fsm.state
        return typeof(Bireader.fsm.m.states[s].on[msg]) !== "undefined" ? true : ''
    }
    let canPrev = () => {
        return can('PREV') && (Bireader.data.currIdx > 0) ? true : ''
    }
    let canNext = () => {
        return can('NEXT')
               && (Bireader.data.currIdx
                    < Bireader.data.segmentList.length-1) ? true : ''
    }
    let onPause = () => { can('PAUSE')  && Bireader.fsm.handle('PAUSE') }
    let onPlay  = () => { can('RESUME') && Bireader.fsm.handle('RESUME') }
    let onPrev  = () => { canPrev() && Bireader.fsm.handle('PREV') }
    let onNext  = () => { canNext() && Bireader.fsm.handle('NEXT') }
    let onMode  = () => { Bireader.data.currMode = Bireader.data.currMode ? 0 : 1 }

    return m('div',[
        modeIcon(),

        m('span.mh3.white.f5','\u00b7'),
        m('i.fa.fa-play'+(can('RESUME')&&click),{onclick:onPlay}),

        m('span.mh3.white.f5','\u00b7'),
        m('i.fa.fa-pause'+(can('PAUSE')&&click),{onclick:onPause}),

        m('span.mh3.white.f5','\u00b7'),
        m('i.fa.fa-step-backward'+(canPrev()&&click),{onclick:onPrev}),

        m('span.mh3.white.f5','\u00b7'),
        m('i.fa.fa-step-forward'+(canNext()&&click),{onclick:onNext}),
    ])
}


// Mock Data
mock.data_segmentList = () => {
    return [
        {   id: 0,
            type: 'chapter-title',
            text: 'Alibaba and The Forty Thieves',
            tran: 'Alibaba และสี่สิบหัวขโมย',
        },
        {   id: 1,
            type: 'paragraph-start',
            text: 'In a town in Persia lived two brothers named Cassim and Alibaba,',
            tran: 'ในเมืองแห่งหนึ่งในเปอร์เซียอาศัยอยู่สองพี่น้องชื่อ Cassim และ Alibaba',
        },
        {   id: 2,
            type: '',
            text: 'between whom their father at his death had left what little property he possessed equally divided.',
            tran: 'ซึ่งพ่อของพวกเขาเสียชีวิตได้ทิ้งทรัพย์สินเล็ก ๆ น้อย ๆ ที่เขามีไว้แบ่งเท่า ๆ กัน',
        },
        // Cassim, however, having married the heiress of a rich
        // merchant, became soon after his marriage the owner of a fine
        // shop, together with several pieces of land, and was in
        // consequence, through no effort of his own, the most
        // considerable merchant in the town.
        {   id: 3,
            type: '',
            text: 'Cassim, however, having married the heiress of a rich merchant',
            tran: 'Cassim แต่งงานกับทายาทของพ่อค้าที่ร่ำรวย',
            start: '00:00:38.56',
            dura : '00:00:03.86',
        },
        {   id: 4,
            type: '',
            text: 'became soon after his marriage the owner of a fine shop, together with several pieces of land,',
            tran: 'ไม่นานหลังจากการแต่งงานของเขาเป็นเจ้าของร้านค้าชั้นดีพร้อมกับที่ดินหลายผืน',
            start: '00:00:42.34',
            dura : '00:00:06.40',
        },
        {   id: 5,
            type: '',
            text: 'and was in consequence, through no effort of his own, the most considerable merchant in the town.',
            tran: 'และด้วยเหตุนี้พ่อค้าที่สำคัญที่สุดในเมืองโดยไม่ต้องใช้ความพยายาม',
            start: '00:00:48.80',
            dura : '00:00:06.93',
        },
        /*
        {   id: ,
            type: '',
            text: '',
            tran: '',
        },
        */
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

