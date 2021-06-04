
let Kids = {
    data: {},
    section: {
        header : undefined,
        list   : undefined,
        video  : undefined,
    },
    view: () => {
        return m('div',[
            Kids.section.header(),
            Kids.section.list(),
            Kids.section.video(),
        ])
    }
}

// Section Views
Kids.section.header = () => {
    return m('h1', Kids.data.kidName)
}
Kids.section.list = () => {
    let item = id => {
        let vid = Kids.data.videos[id]
        return m('div.w-100.v-top',
                 { onclick: () => {
                     Kids.data.video = vid.src
                     console.log(Kids.data.video)
                 }},[
                     m('img.w-40',{src:vid.thumb}),
                     m('div.ml1.dib.w-50.f5.v-top',[
                         m('div.black',vid.name),
                         m('div.f7',vid.dura),
                     ])
                ])

        return m('li',
                 { onclick: () => {
                     Kids.data.video = vid.src
                     console.log(Kids.data.video)
                 }},
                 vid.name)
    }
    return m('div.mh2', Kids.data.vList.reverse().map(item))
}
Kids.section.video = () => {
    if (!Kids.data.video) { return null }           // Show nothing if No video define

    let vidlink = document.getElementById('vidlink')
    vidlink.href = Kids.data.video
    vidlink.click()
    console.log('Playing: '+Kids.data.video)
}

// Mock Data
let mock = {}
mock.video_list = () => {
    let root = 'http://192.168.1.32/Bilingual-Reader-Demo'
    return {
        1: {
            id   : 1,
            name : "How can I help you",
            src  : root+'/video/H31UA2EQSRc.webm',
            thumb: root+'/video/H31UA2EQSRc.png',
            dura : '11:31',
        },
        2: {
            id   : 2,
            name : "The Clever Shoemaker",
            src  : root+'/video/f90Xd7vKUHs.webm',
            thumb: root+'/video/f90Xd7vKUHs.png',
            dura : '12:29',
        },
        3: {
            id   : 3,
            name : "Kids Dialogues",
            src  : root+'/video/FdlLsxR5AE0.mp4',
            thumb: root+'/video/FdlLsxR5AE0.png',
            dura : '43:02',
        },
        4: {
            id   : 4,
            name : "English Phonics Story",
            src  : root+'/video/mO2tQvrqYHk.mp4',
            thumb: root+'/video/mO2tQvrqYHk.png',
            dura : '57:45',
        },
        5: {
            id   : 5,
            name : 'Good Morning',
            src  : root+'/video/8irSFvoyLHQ.webm',
            thumb: root+'/video/8irSFvoyLHQ.png',
            dura : '37:42',
        },
        6: {
            id   : 6,
            name : 'Phonics - Letter Sounds',
            src  : root+'/video/XUvlnKMSVDQ.mp4',
            thumb: root+'/video/XUvlnKMSVDQ.png',
            dura : '41:10',
        },
        7: {
            id   : 7,
            name : 'The Four Brothers',
            src  : root+'/video/mhvRk_46G_g.webm',
            thumb: root+'/video/mhvRk_46G_g.png',
            dura : '13:13',
        },
        8: {
            id   : 8,
            name : 'Romeo and Juliet',
            src  : root+'/video/mMFE0IIHR6I.webm',
            thumb: root+'/video/mMFE0IIHR6I.png',
            dura : '27:10',
        },
        9: {
            id   : 9,
            name : 'Ruff Day on the Job 🐾',
            src  : root+'/video/XCFEBi3m7Lo.mp4',
            thumb: root+'/video/XCFEBi3m7Lo.png',
            dura : '23:16',
        },
        10: {
            id   : 10,
            name : 'Sight Words - Lesson 1',
            src  : root+'/video/eEcSuinkI5Q-01.webm',
            thumb: root+'/video/eEcSuinkI5Q-01.png',
            dura : '6:50',
        },
        11: {
            id   : 11,
            name : '100 Opposite Words',
            src  : root+'/video/WrdHwPfmk3M.webm',
            thumb: root+'/video/WrdHwPfmk3M.png',
            dura : '17:00',
        },


    }
}
mock.kid_videos = nick => {
    return {
        pat: [1,2,3,4],
        nan: [1,2,7,8,11],
        wa : [1,2,7,10],
        nai: [3,4,5,6,9],
    }[nick]
}

// Data Elements
Kids.data.kids = () => {
    return {
        pat: { name: 'Patcharin Chudoung' },
        nan: { name: 'Warapond Chudoung' },
        wa : { name: 'Thunwa Chudoung' },
        nai: { name: 'Warinthon Chudoung' },
    }
}
Kids.data_init = () => {
    const params = new URLSearchParams(window.location.search);
    const nick = params.get("nick")
    Kids.data.nick = nick
    Kids.data.kidName = Kids.data.kids()[nick].name
    Kids.data.videos = mock.video_list()
    Kids.data.vList  = mock.kid_videos(nick)
}

Kids.data_init()
