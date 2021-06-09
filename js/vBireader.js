
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
        segmentList: mock.data_segmentList(),
        imgList    : mock.data_imageList(),
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
                    FIRST: 'play',
                    JUMP : 'play',
                }
            },
            play: {
                on: {
                    PAUSE : 'paused',      // pause play
                    NEXT  : 'play',        // play next segment
                    PREV  : 'play',        // play prev segment
                    END   : 'ended',       // no more segments
                    JUMP  : 'play',
                }
            },
            paused: {
                on: {
                    RESUME: 'play',        // resume play
                    NEXT  : 'play',        // play next segment
                    PREV  : 'play',        // play prev segment
                    JUMP  : 'play',
                }
            },
            ended: {
                on: {
                    FIRST: 'play',
                    JUMP : 'play',
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
        console.log(Bireader.data.currIdx)
        Bireader.data.currIdx++
    } else if (evt === 'PREV') {
        Bireader.data.currIdx--
    } else if (evt === 'JUMP') {
        Bireader.data.currIdx = Number(data)
    } else {    // RESUME, MODE
        // Bireader.data.currMode = 1
    }

    let ptd = document.querySelector(                   // Find target segment
            '[data-ptr="'+Bireader.data.currIdx+'"]')
    if (ptd) {                                          // If found
        ptd.scrollIntoView({                            //   scroll segment
            behaviour:"smooth",                         //   smoothly into view
            block:"center"})                            //   to the center
    }

    m.redraw()

    let segment = Bireader.data.segmentList[
        Bireader.data.currIdx]
    if (segment.type === 'image') { return }

    // Setup the audioNow tag and play it
    let now = document.getElementById('audioNow')
    now.onended = () => {
        m.redraw()
        // Check whether next segment exists
        let j = Number(Bireader.data.currIdx) + 1
        console.log(j , Bireader.data.segmentList.length-1)
        if (j <= Bireader.data.segmentList.length-1) {
            // If AUTO mode (1), send NEXT
            // if MANUAL mode (0), send PAUSE
            Bireader.fsm.handle(Bireader.data.currMode ? 'NEXT' : 'PAUSE')
        } else {
            Bireader.fsm.handle('END')
        }
    }
    now.src = Bireader.data.segmentList[Bireader.data.currIdx].src
    now.play()
    .then(res => {
        console.log('Playing segment:' + Bireader.data.currIdx)
    })

    // Preload next segment into audioNext
    if (Bireader.data.currIdx+1 < Bireader.data.segmentList.length) {
        let next = document.getElementById('audioNext')
        next.src = Bireader.data.segmentList[Bireader.data.currIdx+1].src
        next.preload = true
    }

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
    let text = m('div.main',Bireader.data.segmentList.map(s => {
        let pointed = s.id === Bireader.data.currIdx ? '.pointed' : ''

        let seg1 =
            m('span.'+s.type+pointed,
                {'data-ptr': s.id},
                 s.text+' ')

        let seg2 = [
            m('img.mv2.br3', {src:s.image}),
            m('span.'+s.type+pointed,
                {'data-ptr': s.id},
                 s.text+' ')
        ]

        return s.image ? seg2 : seg1
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
    return m('div.ph2.pt1.navy.bg-lightest-blue.bt.bw1.b--light-blue',
             Bireader.data.segmentList[Bireader.data.currIdx].tran)
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
mock.data_segmentList_alibaba = () => {
    return [
        {   id: 0,
            type: 'chapter-title',
            text: 'Alibaba and The Forty Thieves',
            tran: 'Alibaba และสี่สิบหัวขโมย',
            src : 'audio/0.mp3'
        },
        {   id: 1,
            type: 'paragraph-start',
            text: 'In a town in Persia lived two brothers named Cassim and Alibaba,',
            tran: 'ในเมืองแห่งหนึ่งในเปอร์เซียอาศัยอยู่สองพี่น้องชื่อ Cassim และ Alibaba',
            src : 'audio/1.mp3'
        },
        {   id: 2,
            type: '',
            text: 'between whom their father at his death had left what little property he possessed equally divided.',
            tran: 'ซึ่งพ่อของพวกเขาเสียชีวิตได้ทิ้งทรัพย์สินเล็ก ๆ น้อย ๆ ที่เขามีไว้แบ่งเท่า ๆ กัน',
            src : 'audio/2.mp3'
        },
        {   id: 3,
            type: '',
            text: 'Cassim, however, having married the heiress of a rich merchant',
            tran: 'Cassim แต่งงานกับทายาทของพ่อค้าที่ร่ำรวย',
            start: '00:00:38.56',
            dura : '00:00:03.86',
            src  : 'audio/3.mp3'
        },
        {   id: 4,
            type: '',
            text: 'became soon after his marriage the owner of a fine shop, together with several pieces of land,',
            tran: 'ไม่นานหลังจากการแต่งงานของเขาเป็นเจ้าของร้านค้าชั้นดีพร้อมกับที่ดินหลายผืน',
            start: '00:00:42.34',
            dura : '00:00:06.40',
            src  : 'audio/4.mp3'
        },
        {   id: 5,
            type: '',
            text: 'and was in consequence, through no effort of his own, the most considerable merchant in the town.',
            tran: 'และด้วยเหตุนี้พ่อค้าที่สำคัญที่สุดในเมืองโดยไม่ต้องใช้ความพยายาม',
            start: '00:00:48.80',
            dura : '00:00:06.93',
            src  : 'audio/5.mp3'
        },
        {   id: 6,
            type: '',
            text: 'Alibaba, on the other hand, was married to one as poor as himself,',
            tran: 'ในทางกลับกัน Alibaba ได้แต่งงานกับคนยากจนเช่นเดียวกับตัวเขาเอง',
            start: '00:00:56.08',
            dura : '00:00:04.82',
            src  : 'audio/6.mp3'
        },
        {   id: 7,
            type: '',
            text: 'and having no other means of gaining a livelihood he used to go every day into the forest to cut wood,',
            tran: 'และไม่มีหนทางอื่นในการหาเลี้ยงชีพเขาต้องเข้าไปในป่าทุกวันเพื่อตัดฟืน',
            start: '00:01:00.84',
            dura : '00:00:07.06',
            src  : 'audio/7.mp3'
        },
        {   id: 8,
            type: 'paragraph-stop',
            text: 'and lading therewith the three asses which were his sole stock-in-trade, would then hawk it about the streets for sale.',
            tran: 'และบรรทุกลาสามตัวซึ่งเป็นสมบัติอันน้อยนิดของเขา จากนั้นก็จะเร่ขายไปตามท้องถนน',
            start: '00:01:07.92',
            dura : '00:00:08.49',
            src  : 'audio/8.mp3'
        },
        {   id: 9,
            type: 'paragraph-start',
            text: 'One day while he was at work within the skirts of the forest,',
            tran: 'วันหนึ่งขณะที่เขาทำงานอยู่ริมป่า',
            src  : 'audio/9.mp3'
        },
        {   id: 10,
            type: '',
            text: 'Ali Baba saw advancing towards him across the open a large company of horsemen,',
            tran: 'อาลีบาบาเห็นนักขี่ม้ากลุ่มใหญ่กำลังขี่เข้ามาหาเขา',
            src  : 'audio/10.mp3'
        },
        {   id: 11,
            type: '',
            text: 'and fearing from their appearance that they might be robbers,',
            tran: 'และกลัวจากรูปลักษณ์ของพวกเขาว่าพวกเขาอาจเป็นโจร',
            start: '00:00:',
            dura : '00:00:',
            src  : 'audio/11.mp3'
        },
        {   id: 12,
            type: '',
            text: 'he left his asses to their own devices',
            tran: 'เขาปล่อยให้ลาดูแลตัวเอง',
            start: '00:00:',
            dura : '00:00:',
            src  : 'audio/12.mp3'
        },
        {   id: 13,
            type: '',
            text: 'and sought safety for himself in the lower branches of a large tree',
            tran: 'และหาความปลอดภัยเพื่อตัวเขาเองในกิ่งล่างของต้นไม้ใหญ่',
            start: '00:00:',
            dura : '00:00:',
            src  : 'audio/13.mp3'
        },
        {   id: 14,
            type: 'paragraph-stop',
            text: 'which grew in the close overshadowing of a precipitous rock.',
            tran: 'ซึ่งเติบโตในเงามืดของหินที่สูงชันมาก',
            start: '00:00:',
            dura : '00:00:',
            src  : 'audio/14.mp3'
        },
        {   id: 15,
            type: 'paragraph-start',
            text: 'Almost immediately it became evident',
            tran: 'แทบจะในทันทีที่เห็นได้ชัด',
            start: '00:00:',
            dura : '00:00:',
            src  : 'audio/15.mp3'
        },
        {   id: 16,
            type: '',
            text: 'that this very rock was the goal toward which the troop was bound,',
            tran: 'ว่าหินก้อนนี้คือเป้าหมายที่พวกเขามุ่งหน้าไป',
            start: '00:00:',
            dura : '00:00:',
            src  : 'audio/16.mp3'
        },
        {   id: 17,
            type: '',
            text: 'for having arrived they alighted instantly from their horses,',
            tran: 'เพราะเมื่อมาถึงพวกเขาก็ลงจากหลังม้าทันที',
            start: '00:00:',
            dura : '00:00:',
            src  : 'audio/17.mp3'
        },
        {   id: 18,
            type: '',
            text: 'and took down each man of them a sack',
            tran: 'และแต่ละคนก็เอาลงหนึ่งกระสอบ',
            start: '00:00:',
            dura : '00:00:',
            src  : 'audio/18.mp3'
        },
        {   id: 19,
            type: '',
            text: 'which seemed by its weight and form to be filled with gold.',
            tran: 'ซึ่งโดยน้ำหนักและรูปแบบของมันดูเหมือนจะเต็มไปด้วยทองคำ',
            start: '00:00:',
            dura : '00:00:',
            src  : 'audio/19.mp3'
        },
        {   id: 20,
            type: '',
            text: 'There could no longer be any doubt that they were robbers.',
            tran: 'ไม่ต้องสงสัยอีกต่อไปว่าพวกเขาเป็นโจร',
            start: '00:00:',
            dura : '00:00:',
            src  : 'audio/20.mp3'
        },
        {   id: 21,
            type: 'paragraph-stop',
            text: 'Ali Baba counted forty of them.',
            tran: 'อาลีบาบานับได้สี่สิบคน',
            start: '00:00:',
            dura : '00:00:',
            src  : 'audio/21.mp3'
        },
        {   id: 22,
            type: 'paragraph-start',
            text: 'Just as he had done so, the one nearest to him, who seemed to be their chief,',
            tran: 'ในขณะที่เขาทำเช่นนั้นคนที่อยู่ใกล้เขาที่สุดซึ่งดูเหมือนจะเป็นหัวหน้าของพวกเขา',
            start: '00:00:',
            dura : '00:00:',
            src  : 'audio/22.mp3'
        },
        {   id: 23,
            type: '',
            text: 'advanced toward the rock, and in a low but distinct voice uttered the two words,',
            tran: 'ก้าวไปสู่ก้อนหินและด้วยเสียงที่ต่ำ แต่ชัดเจนเอ่ยสองคำนี้',
            start: '00:00:',
            dura : '00:00:',
            src  : 'audio/23.mp3'
        },
        {   id: 24,
            type: '',
            text: '"Open, Sesamé!"',
            tran: '"Open, Sesamé!"',
            start: '00:00:',
            dura : '00:00:',
            src  : 'audio/24.mp3',
            image: 'img/1.jpg',
        },
        {   id: 25,
            type: '',
            text: 'Immediately the rock opened like a door,',
            tran: 'ทันใดนั้นหินก็เปิดออกเหมือนประตู',
            start: '00:00:',
            dura : '00:00:',
            src  : 'audio/25.mp3'
        },
        {   id: 26,
            type: 'paragraph-stop',
            text: 'the captain and his men passed in, and the rock closed behind them.',
            tran: 'กัปตันและคนของเขาผ่านไปและหินก็ปิดตามพวกเขา',
            start: '00:00:',
            dura : '00:00:',
            src  : 'audio/26.mp3'
        },
        {   id: 27,
            type: 'paragraph-start',
            text: 'For a long while Ali Baba waited,',
            tran: 'อาลีบาบารอมานาน',
            start: '00:00:',
            dura : '00:00:',
            src  : 'audio/27.mp3'
        },
        {   id: 28,
            type: '',
            text: 'not daring to descend from his hiding-place',
            tran: 'แต่ไม่กล้าลงจากที่ซ่อน',
            start: '00:00:',
            dura : '00:00:',
            src  : 'audio/28.mp3'
        },
        {   id: 29,
            type: '',
            text: 'lest they should come out and catch him in the act;',
            tran: 'เกรงว่าพวกเขาจะออกมาจับเขาขณะทำเช่นนั้น',
            start: '00:00:',
            dura : '00:00:',
            src  : 'audio/29.mp3'
        },
        {   id: 30,
            type: '',
            text: 'but at last, when the waiting had grown almost unbearable,',
            tran: 'ในที่สุดเมื่อการรอคอยมากขึ้นจนแทบทนไม่ได้',
            start: '00:00:',
            dura : '00:00:',
            src  : 'audio/30.mp3'
        },
        {   id: 31,
            type: '',
            text: 'his patience was rewarded,',
            tran: 'ความอดทนของเขาได้รับการตอบแทน',
            start: '00:00:',
            dura : '00:00:',
            src  : 'audio/31.mp3'
        },
        {   id: 32,
            type: '',
            text: 'the door in the rock opened, and out came the forty men,',
            tran: 'ประตูในหินเปิดออกและชายสี่สิบคนก็ออกมา',
            start: '00:00:',
            dura : '00:00:',
            src  : 'audio/32.mp3'
        },
        {   id: 33,
            type: '',
            text: 'their captain leading them.',
            tran: 'โดยมีกัปตันนำพวกเขา',
            start: '00:00:',
            dura : '00:00:',
            src  : 'audio/33.mp3'
        },
        {   id: 34,
            type: '',
            text: 'When the last of them was through,',
            tran: 'เมื่อทั้งหมดออกไปแล้ว',
            start: '00:00:',
            dura : '00:00:',
            src  : 'audio/34.mp3'
        },
        {   id: 35,
            type: '',
            text: '"Shut, Sesamé!" said the captain,',
            tran: 'กัปตันพูดว่า "Shut, Sesamé!"',
            start: '00:00:',
            dura : '00:00:',
            src  : 'audio/35.mp3'
        },
        {   id: 36,
            type: '',
            text: 'and immediately the face of the rock closed together as before.',
            tran: 'และทันทีใบหน้าของหินก็ปิดเข้าหากันเหมือนเดิม',
            start: '00:00:',
            dura : '00:00:',
            src  : 'audio/36.mp3'
        },
        {   id: 37,
            type: 'paragraph-stop',
            text: 'And then they all mounted their horses and rode away.',
            tran: 'จากนั้นทุกคนก็ขึ้นม้าและขี่ออกไป',
            start: '00:00:',
            dura : '00:00:',
            src  : 'audio/37.mp3'
        },
        {   id: 38,
            type: 'paragraph-start',
            text: 'As soon as he felt sure that they were not returning,',
            tran: 'ทันทีที่เขารู้สึกแน่ใจว่าพวกเขาจะไม่กลับมา',
            start: '00:00:',
            dura : '00:00:',
            src  : 'audio/38.mp3'
        },
        {   id: 39,
            type: '',
            text: 'Ali Baba came down from the tree',
            tran: 'อาลีบาบาลงมาจากต้นไม้',
            start: '00:00:',
            dura : '00:00:',
            src  : 'audio/39.mp3'
        },
        {   id: 40,
            type: '',
            text: 'and made his way at once to that part of the rock',
            tran: 'และไปทันทีที่ส่วนนั้นของหิน',
            start: '00:00:',
            dura : '00:00:',
            src  : 'audio/40.mp3'
        },
        {   id: 41,
            type: '',
            text: 'where he had seen the captain and his men enter.',
            tran: 'ที่เขาได้เห็นกัปตันและลูกน้องเข้าไป',
            start: '00:00:',
            dura : '00:00:',
            src  : 'audio/41.mp3'
        },
        {   id: 42,
            type: '',
            text: 'And there at the word "Open, Sesamé!"',
            tran: 'และตรงคำว่า Open, Sesamé!',
            start: '00:00:',
            dura : '00:00:',
            src  : 'audio/42.mp3'
        },
        {   id: 43,
            type: 'paragraph-stop',
            text: 'a door suddenly revealed itself and opened.',
            tran: 'ทันใดนั้นประตูก็มองเห็นได้และเปิดออก',
            start: '00:00:',
            dura : '00:00:',
            src  : 'audio/43.mp3'
        },
        {   id: 44,
            type: 'paragraph-start',
            text: 'Ali Baba had expected to find a dark and gloomy cavern.',
            tran: 'อาลีบาบาคาดว่าจะพบถ้ำที่มืดมน',
            start: '00:00:',
            dura : '00:00:',
            src  : 'audio/44.mp3'
        },
        {   id: 45,
            type: '',
            text: 'Great was his astonishment therefore',
            tran: 'เขาจึงประหลาดใจมาก',
            start: '00:00:',
            dura : '00:00:',
            src  : 'audio/45.mp3'
        },
        {   id: 46,
            type: '',
            text: 'when he perceived a spacious and vaulted chamber',
            tran: 'เมื่อเขาเห็นห้องที่กว้างขวางและมีหลังคาโค้ง',
            start: '00:00:',
            dura : '00:00:',
            src  : 'audio/46.mp3'
        },
        {   id: 46,
            type: '',
            text: 'lighted from above through a fissure in the rock',
            tran: 'มีแสงส่องมาจากเบื้องบนผ่านรอยแยกในหิน',
            start: '00:00:',
            dura : '00:00:',
            src  : 'audio/46.mp3'
        },
        {   id: 48,
            type: '',
            text: 'and there spread out before him lay treasures in profusion,',
            tran: 'แล้ววางไว้ต่อหน้าเขาคือสมบัติมากมาย',
            start: '00:00:',
            dura : '00:00:',
            src  : 'audio/48.mp3'
        },
        {   id: 49,
            type: '',
            text: 'bales of merchandise, silks, carpets, brocades,',
            tran: 'กองสินค้า, ผ้าไหม, พรม, ผ้าทอ,',
            start: '00:00:',
            dura : '00:00:',
            src  : 'audio/49.mp3'
        },
        {   id: 50,
            type: '',
            text: 'and above all gold and silver lying in loose heaps or in sacks piled one upon another.',
            tran: 'และเหนือสิ่งอื่นใด ทองคำและเงินที่วางกองรวมกันเป็นกองๆ หรือใส่กระสอบซ้อนกัน ',
            start: '00:00:',
            dura : '00:00:',
            src  : 'audio/50.mp3'
        },
    ]
}
mock.data_segmentList_alibaba_zh = () => {
    return [
        {   id: 0,
            type: 'chapter-title',
            text: 'Alibaba and The Forty Thieves',
            tran: '阿里巴巴和四十个小偷',
            src : 'audio/0.mp3'
        },
        {   id: 1,
            type: 'paragraph-start',
            text: 'In a town in Persia lived two brothers named Cassim and Alibaba,',
            tran: '在波斯的一个城镇里，有两个兄弟，分别叫卡西姆（Cassim）和阿里巴巴（Alibaba),',
            src : 'audio/1.mp3'
        },
        {   id: 2,
            type: '',
            text: 'between whom their father at his death had left what little property he possessed equally divided.',
            tran: '他们父亲去世时，他所拥有的几乎所有财产几乎都分配给他们之间。',
            src : 'audio/2.mp3'
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
            src : 'audio/3.mp3'
        },
        {   id: 4,
            type: '',
            text: 'became soon after his marriage the owner of a fine shop, together with several pieces of land,',
            tran: '结婚后不久成为一家高级商店以及几块土地的所有者,',
            start: '00:00:42.34',
            dura : '00:00:06.40',
            src : 'audio/4.mp3'
        },
        {   id: 5,
            type: '',
            text: 'and was in consequence, through no effort of his own, the most considerable merchant in the town.',
            tran: '结果，他自己全力以赴，成为了镇上最重要的商人。',
            start: '00:00:48.80',
            dura : '00:00:06.93',
            src : 'audio/5.mp3'
        },
        // Alibaba, on the other hand, was married to one as poor as himself, and having no other means of gaining a livelihood he used to go every day into the forest to cut wood, and lading therewith the three asses which were his sole stock-in-trade, would then hawk it about the streets for sale.
        {   id: 6,
            type: '',
            text: 'Alibaba, on the other hand, was married to one as poor as himself,',
            tran: '另一方面，阿里巴巴嫁给了一个和自己一样穷的人，',
            start: '00:00:56.08',
            dura : '00:00:04.82',
            src : 'audio/6.mp3'
        },
        {   id: 7,
            type: '',
            text: 'and having no other means of gaining a livelihood he used to go every day into the forest to cut wood,',
            tran: '他没有其他谋生手段，他以前每天都去森林砍伐木材,',
            start: '00:01:00.84',
            dura : '00:00:07.06',
            src : 'audio/7.mp3'
        },
        {   id: 8,
            type: 'paragraph-stop',
            text: 'and lading therewith the three asses which were his sole stock-in-trade, would then hawk it about the streets for sale.',
            tran: '然后与这三个驴子一起装货，这是他唯一的存货，然后将其贩卖到街上待售。',
            start: '00:01:07.92',
            dura : '00:00:08.49',
            src : 'audio/8.mp3'
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
mock.data_segmentList_chat = () => {
    return [
        {   id: 0,
            type: 'chapter-title',
            text: 'Conversation One',
            tran: 'การสนทนาที่หนึ่ง',
            src : 'audio/c0.mp3',
        },
        {   id: 1,
            type: 'speaker-one',
            text: 'I like your family photos. Who is this?',
            tran: 'ฉันชอบรูปครอบครัวของคุณ นี่คือใคร',
            src : 'audio/c1.mp3',
            image: 'img/c1.png',
        },
        {   id: 2,
            type: 'speaker-two',
            text: 'That is my dad. He is a doctor.',
            tran: 'นั่นคือพ่อของฉัน เขาเป็นหมอ',
            src : 'audio/c2.mp3',
        },
        {   id: 3,
            type: 'speaker-one',
            text: 'Wow. He is very tall.',
            tran: 'ว้าว เขาตัวสูงมาก',
            src  : 'audio/c3.mp3',
        },
        {   id: 4,
            type: 'speaker-two',
            text: 'Yes, he is.',
            tran: 'ใช่',
            src : 'audio/c4.mp3'
        },
        {   id: 5,
            type: 'speaker-one',
            text: 'Is this your mom?',
            tran: 'นี่แม่ของคุณเหรอ',
            src : 'audio/c5.mp3'
        },
        // Alibaba, on the other hand, was married to one as poor as himself, and having no other means of gaining a livelihood he used to go every day into the forest to cut wood, and lading therewith the three asses which were his sole stock-in-trade, would then hawk it about the streets for sale.
        {   id: 6,
            type: '',
            type: 'speaker-two',
            text: 'Yes, she is a doctor too.',
            tran: 'ใช่ เธอเป็นหมอด้วย',
            src : 'audio/c6.mp3'
        },
        {   id: 7,
            type: 'speaker-one',
            text: 'Wow, smart family.',
            tran: 'ว้าวครอบครัวที่ฉลาด',
            src  : 'audio/c7.mp3'
        },
        /*
        {   id: ,
            type: '',
            text: '',
            tran: '',
            src : 'audio/.mp3'
        },
        */
    ]
}
mock.data_segmentList_chat2 = () => {
    return [
        {   id: 0,
            type: 'chapter-title',
            text: 'Conversation Two',
            tran: 'การสนทนาที่สอง',
            src : 'audio/c2_0.mp3',
        },
        {   id: 1,
            type: 'speaker-one',
            text: 'Who are these people?',
            tran: 'คนเหล่านี้คือใคร?',
            src : 'audio/c2_1.mp3',
            image: 'img/c2.png',
        },
        {   id: 2,
            type: 'speaker-two',
            text: 'That is my husband. In this picture, he is at work.',
            tran: 'นั่นคือสามีของฉัน ในภาพนี้เขาอยู่ที่ทำงาน',
            src : 'audio/c2_2.mp3',
        },
        {   id: 3,
            type: 'speaker-one',
            text: 'Oh, is he a fireman?',
            tran: 'โอ้เขาเป็นพนักงานดับเพลิงเหรอ',
            src  : 'audio/c2_3.mp3',
        },
        {   id: 4,
            type: 'speaker-two',
            text: 'Yes, he is. And this is my daughter.',
            tran: 'ใช่. และนี่คือลูกสาวของฉัน',
            src : 'audio/c2_4.mp3'
        },
        {   id: 5,
            type: 'speaker-one',
            text: 'Wow, she is so cute.',
            tran: 'ว้าวเธอน่ารักมาก',
            src : 'audio/c2_5.mp3'
        },
        {   id: 6,
            type: 'speaker-two',
            text: 'Yes, she is cute!',
            tran: 'ใช่เธอน่ารัก',
            src : 'audio/c2_6.mp3'
        },
    ]
}
mock.data_segmentList_chat3 = () => {
    return [
        {   id: 0,
            type: 'chapter-title',
            text: 'Conversation Three',
            tran: 'การสนทนาที่สาม',
            src : 'audio/c3_0.mp3',
        },
        {   id: 1,
            type: 'speaker-one',
            text: 'Who are the people in this picture?',
            tran: 'คนในภาพนี้คือใคร?',
            src : 'audio/c3_1.mp3',
            image: 'img/c3.png',
        },
        {   id: 2,
            type: 'speaker-two',
            text: 'That is my older brother and younger sister.',
            tran: 'นั่นคือพี่ชายและน้องสาวของฉัน',
            src : 'audio/c3_2.mp3',
        },
        {   id: 3,
            type: 'speaker-one',
            text: 'Oh, what do they do?',
            tran: 'โอ้พวกเขาทำอะไร?',
            src  : 'audio/c3_3.mp3',
        },
        {   id: 4,
            type: 'speaker-two',
            text: 'My sister is a pilot. My brother is a farmer.',
            tran: 'พี่สาวของฉันเป็นนักบิน พี่ชายของฉันเป็นชาวนา',
            src : 'audio/c3_4.mp3'
        },
        {   id: 5,
            type: 'speaker-one',
            text: 'Wow. They have cool jobs.',
            tran: 'ว้าว. พวกเขามีงานเจ๋ง ๆ',
            src : 'audio/c3_5.mp3'
        },
        {   id: 6,
            type: 'speaker-two',
            text: 'Yeah, they do!',
            tran: 'ใช่!',
            src : 'audio/c3_6.mp3'
        },
    ]
}
mock.data_segmentList_chat4 = () => {
    return [
        {   id: 0,
            type: 'chapter-title',
            text: 'Conversation Four',
            tran: 'การสนทนาที่สี่',
            src : 'audio/c4_0.mp3',
        },
        {   id: 1,
            type: 'speaker-one',
            text: 'And who are these people?',
            tran: 'แล้วคนเหล่านี้คือใคร',
            src : 'audio/c4_1.mp3',
            image: 'img/c4.png',
        },
        {   id: 2,
            type: 'speaker-two',
            text: 'Those are my grandparents.',
            tran: 'นั่นคือปู่ย่าตายายของฉัน',
            src : 'audio/c4_2.mp3',
        },
        {   id: 3,
            type: 'speaker-one',
            text: 'Oh, do they live in town?',
            tran: 'โอ้พวกเขาอาศัยอยู่ในเมืองหรือไม่',
            src  : 'audio/c4_3.mp3',
        },
        {   id: 4,
            type: 'speaker-two',
            text: 'No, they live in the country. They have a farm.',
            tran: 'ไม่พวกเขาอาศัยอยู่ในชนบท พวกเขามีฟาร์ม',
            src : 'audio/c4_4.mp3'
        },
        {   id: 5,
            type: 'speaker-one',
            text: 'How nice!',
            tran: 'ดีแค่ไหน!',
            src : 'audio/c4_5.mp3'
        },
        {   id: 6,
            type: 'speaker-two',
            text: 'Yeah, I go there often.',
            tran: 'ใช่ฉันไปที่นั่นบ่อย',
            src : 'audio/c4_6.mp3'
        },
    ]
}
mock.data_segmentList_sanzijing = () => {
    return [
        {   id: 0,
            type: 'chapter-title',
            text: '三 字 经',
            tran: 'sān zì jīnɡ - Three Character Classic',
            src : 'audio/szj0.mp3'
        },
        {   id: 1,
            type: 'speaker-one',
            text: '人 之 初 , 性 本 善 。',
            tran: 'rén zhī chū , xìnɡ běn shàn 。Men at their birth are naturally good.',
            src : 'audio/szj1.mp3'
        },
        {   id: 2,
            type: 'speaker-two',
            text: '性 相 近 , 习 相 远 。',
            tran: 'xìnɡ xiānɡ jìn , xí xiānɡ yuǎn 。Their natures are much the same; their habits become widely different.',
            src : 'audio/szj2.mp3'
        },
        {   id: 3,
            type: 'speaker-one',
            text: '苟 不 教 , 性 乃 迁 。',
            tran: 'ɡǒu bù jiāo , xìnɡ nǎi qiān 。If foolishly there is no teaching, the nature will deteriorate.',
            src  : 'audio/szj3.mp3'
        },
        {   id: 4,
            type: 'speaker-two',
            text: '教 之 道 , 贵 以 专 。',
            tran: 'jiāo zhī dào , ɡuì yǐ zhuān 。The right way in teaching, is to attach the utmost importance to thoroughness.',
            src : 'audio/szj4.mp3'
        },
        {   id: 5,
            type: 'speaker-one',
            text: '昔 孟 母 , 择 邻 处 。',
            tran: 'xī mènɡ mǔ , zé lín chù 。Of old, the mother of Mencius chose a neighbourhood;',
            src : 'audio/szj5.mp3'
        },
        {   id: 6,
            type: 'speaker-two',
            text: '子 不 学 , 断 机 杼 。',
            tran: 'zǐ bù xué , duàn jī zhù 。and when her child would not learn, she broke the shuttle from the loom.',
            src : 'audio/szj6.mp3'
        },
        {   id: 7,
            type: 'speaker-one',
            text: '窦 燕 山 , 有 义 方 。',
            tran: 'dòu yàn shān , yǒu yì fānɡ 。Tou of the Swallow Hills had the right method.',
            src  : 'audio/szj7.mp3'
        },
        {   id: 8,
            type: 'speaker-two',
            text: '教 五 子 , 名 俱 扬 。',
            tran: 'jiāo wǔ zǐ , mínɡ jù yánɡ 。He taught five sons, each of whom raised the family reputation.',
            src : 'audio/szj8.mp3'
        },
        /*
        {   id: ,
            type: '',
            text: '',
            tran: '',
            src : 'audio/.mp3'
        },
        */
    ]
}
mock.data_segmentList_word_doctor = () => {
    return [
        {   id: 0,
            type: 'chapter-title',
            text: 'Doctor',
            tran: 'หมอ',
            start: '00:00:',
            dura : '00:00:',
            src  : 'audio/doctor0.mp3',
            image: 'img/doctor0.jpg',
        },
        {   id: 1,
            type: 'speaker-one',
            text: 'My father is a doctor.',
            tran: 'พ่อของฉันเป็นหมอ',
            start: '00:00:',
            dura : '00:00:',
            src  : 'audio/doctor1.mp3'
        },
        {   id: 2,
            type: 'speaker-two',
            text: 'My mother is a doctor.',
            tran: 'แม่ของฉันเป็นหมอ',
            start: '00:00:',
            dura : '00:00:',
            src  : 'audio/doctor2.mp3'
        },
        {   id: 3,
            type: 'speaker-one',
            text: 'I am studying to be a doctor.',
            tran: 'ฉันกำลังเรียนเพื่อเป็นหมอ',
            start: '00:00:',
            dura : '00:00:',
            src  : 'audio/doctor3.mp3'
        },
        {   id: 4,
            type: 'speaker-two',
            text: 'I want to be a doctor.',
            tran: 'ฉันอยากเป็นหมอ',
            start: '00:00:',
            dura : '00:00:',
            src  : 'audio/doctor4.mp3'
        },
        {   id: 5,
            type: 'speaker-one',
            text: 'Most doctors work in a hospital.',
            tran: 'แพทย์ส่วนใหญ่ทำงานในโรงพยาบาล',
            start: '00:00:',
            dura : '00:00:',
            src  : 'audio/doctor5.mp3'
        },

    ]
}

mock.data_imageList_alibaba = () => {
    return [
        {
            src: 'img/1.jpg',
        }
    ]
}
mock.data_none = () => {
    return []
}

const params = new URLSearchParams(window.location.search);
const page = params.get("page") || 'alibaba'
console.log(page)
mock.data_segmentList = mock['data_segmentList_'+page]
mock.data_imageList   = mock['data_imageList_'+page]
                        || mock.data_none               // Default if not found

// Setup before start
Bireader.data = Bireader.data_init()
Bireader.fsm = {
    m       : Bireader.fsm_mach(),
    handle  : Bireader.fsm_handle,
    state   : 'start',
    dispatch: Bireader.fsm_dispatch(),
}
// Bireader.fsm.handle('READY');   // Start the FSM

