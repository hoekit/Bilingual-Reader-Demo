
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
                {onclick:() => window.location.href = './index.html'}),
            m('span.mh3.white.f5','\u00b7'),
            m('span.dark-blue',
                {onclick:() => {Bireader.fsm.handle('FIRST')}},
                m('i.fa.fa-play')),
        ]

    // Show Repeat button on end
    } else if (Bireader.fsm.state === 'ended') {
        return [
            m('i.fa.fa-home'+click,
                {onclick:() => window.location.href = './index.html'}),
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
            tran: '阿里巴巴和四十个小偷',
        },
        {   id: 1,
            type: 'paragraph-start',
            text: 'In a town in Persia lived two brothers named Cassim and Alibaba,',
            tran: '在波斯的一个城镇里，有两个兄弟，分别叫卡西姆（Cassim）和阿里巴巴（Alibaba),',
        },
        {   id: 2,
            type: '',
            text: 'between whom their father at his death had left what little property he possessed equally divided.',
            tran: '他们父亲去世时，他所拥有的几乎所有财产几乎都分配给他们之间。',
        },
        // Cassim, however, having married the heiress of a rich
        // merchant, became soon after his marriage the owner of a fine
        // shop, together with several pieces of land, and was in
        // consequence, through no effort of his own, the most
        // considerable merchant in the town.
        {   id: 3,
            type: '',
            text: 'Cassim, however, having married the heiress of a rich merchant',
            tran: '卡西姆（Cassim）然而嫁给了一位富商的女继承人',
            start: '00:00:38.56',
            dura : '00:00:03.86',
        },
        {   id: 4,
            type: '',
            text: 'became soon after his marriage the owner of a fine shop, together with several pieces of land,',
            tran: '结婚后不久成为一家高级商店以及几块土地的所有者,',
            start: '00:00:42.34',
            dura : '00:00:06.40',
        },
        {   id: 5,
            type: '',
            text: 'and was in consequence, through no effort of his own, the most considerable merchant in the town.',
            tran: '结果，他自己全力以赴，成为了镇上最重要的商人。',
            start: '00:00:48.80',
            dura : '00:00:06.93',
        },
        // Alibaba, on the other hand, was married to one as poor as himself, and having no other means of gaining a livelihood he used to go every day into the forest to cut wood, and lading therewith the three asses which were his sole stock-in-trade, would then hawk it about the streets for sale.
        {   id: 6,
            type: '',
            text: 'Alibaba, on the other hand, was married to one as poor as himself,',
            tran: '另一方面，阿里巴巴嫁给了一个和自己一样穷的人，',
            start: '00:00:56.08',
            dura : '00:00:04.82',
        },
        {   id: 7,
            type: '',
            text: 'and having no other means of gaining a livelihood he used to go every day into the forest to cut wood,',
            tran: '他没有其他谋生手段，他以前每天都去森林砍伐木材,',
            start: '00:01:00.84',
            dura : '00:00:07.06',
        },
        {   id: 8,
            type: 'paragraph-stop',
            text: 'and lading therewith the three asses which were his sole stock-in-trade, would then hawk it about the streets for sale.',
            tran: '然后与这三个驴子一起装货，这是他唯一的存货，然后将其贩卖到街上待售。',
            start: '00:01:07.92',
            dura : '00:00:08.49',
        },
        /*
        {   id: ,
            type: '',
            text: '',
            tran: '',
            start: '00:00:',
            dura : '00:00:',
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

