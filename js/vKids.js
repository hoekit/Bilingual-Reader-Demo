
let Kids = {
    data: {},
    section: {
        header : undefined,
        list   : undefined,
        video  : undefined,
    },
    view: () => {
        if (typeof(Kids.data.kidName) == "undefined") {
            return m('div',[
                m('h1', "Kid's Videos"),
                m('a', {href:'./kids.html?nick=pat'}, 'Patcharin (Pat)'),
                m('br'),'| ',
                m('a', {href:'./kids.html?nick=nan'}, 'Warapond (Nan)'),
                m('br'),'| ',
                m('a', {href:'./kids.html?nick=wa'}, 'Thunwa (Wa)'),
                m('br'),'| ',
                m('a', {href:'./kids.html?nick=nai'}, 'Warinthon (Nai)'),
            ])
        }
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
    let root = '.'
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
            src  : root+'/video/WrdHwPfmk3M.mp4',
            thumb: root+'/video/WrdHwPfmk3M.png',
            dura : '17:00',
        },
        12: {
            id   : 12,
            name : 'Sight Words - Lesson 2',
            src  : root+'/video/eEcSuinkI5Q-02.webm',
            thumb: root+'/video/eEcSuinkI5Q-02.png',
            dura : '6:11',
        },
        13: {
            id   : 13,
            name : 'Sight Words - Lesson 3',
            src  : root+'/video/eEcSuinkI5Q-03.webm',
            thumb: root+'/video/eEcSuinkI5Q-03.png',
            dura : '5:59',
        },
        14: {
            id   : 14,
            name : 'Sight Words - Lesson 4',
            src  : root+'/video/eEcSuinkI5Q-04.webm',
            thumb: root+'/video/eEcSuinkI5Q-04.png',
            dura : '6:05',
        },
        15: {
            id   : 15,
            name : 'Sight Words - Lesson 5',
            src  : root+'/video/eEcSuinkI5Q-05.webm',
            thumb: root+'/video/eEcSuinkI5Q-05.png',
            dura : '6:16',
        },
        16: {
            id   : 16,
            name : 'Sight Words - Lesson 6',
            src  : root+'/video/eEcSuinkI5Q-06.webm',
            thumb: root+'/video/eEcSuinkI5Q-06.png',
            dura : '6:28',
        },
        17: {
            id   : 17,
            name : 'Sight Words - Lesson 7',
            src  : root+'/video/eEcSuinkI5Q-07.webm',
            thumb: root+'/video/eEcSuinkI5Q-07.png',
            dura : '6:48',
        },
        19: {
            id   : 19,
            name : 'Sight Words - Lesson 9',
            src  : root+'/video/eEcSuinkI5Q-09.webm',
            thumb: root+'/video/eEcSuinkI5Q-09.png',
            dura : '6:22',
        },
        20: {
            id   : 20,
            name : 'Sight Words - Lesson 10',
            src  : root+'/video/eEcSuinkI5Q-10.webm',
            thumb: root+'/video/eEcSuinkI5Q-10.png',
            dura : '7:00',
        },
        21: {
            id   : 21,
            name : 'Sight Words - Lesson 11',
            src  : root+'/video/eEcSuinkI5Q-11.webm',
            thumb: root+'/video/eEcSuinkI5Q-11.png',
            dura : '6:06',
        },
        22: {
            id   : 22,
            name : 'Sight Words - Lesson 12',
            src  : root+'/video/eEcSuinkI5Q-12.webm',
            thumb: root+'/video/eEcSuinkI5Q-12.png',
            dura : '6:35',
        },
        23: {
            id   : 23,
            name : 'Sight Words - Lesson 13',
            src  : root+'/video/eEcSuinkI5Q-13.webm',
            thumb: root+'/video/eEcSuinkI5Q-13.png',
            dura : '6:08',
        },
        24: {
            id   : 24,
            name : 'Sight Words - Lesson 14',
            src  : root+'/video/eEcSuinkI5Q-14.webm',
            thumb: root+'/video/eEcSuinkI5Q-14.png',
            dura : '5:46',
        },
        25: {
            id   : 25,
            name : 'Sight Words - Lesson 15',
            src  : root+'/video/eEcSuinkI5Q-15.webm',
            thumb: root+'/video/eEcSuinkI5Q-15.png',
            dura : '6:01',
        },
        26: {
            id   : 26,
            name : 'Sight Words - Lesson 16',
            src  : root+'/video/eEcSuinkI5Q-16.webm',
            thumb: root+'/video/eEcSuinkI5Q-16.png',
            dura : '5:39',
        },
        27: {
            id   : 27,
            name : 'Sight Words - Lesson 17',
            src  : root+'/video/eEcSuinkI5Q-17.webm',
            thumb: root+'/video/eEcSuinkI5Q-17.png',
            dura : '5:54',
        },
        28: {
            id   : 28,
            name : 'Sight Words - Lesson 18',
            src  : root+'/video/eEcSuinkI5Q-18.webm',
            thumb: root+'/video/eEcSuinkI5Q-18.png',
            dura : '5:54',
        },
        29: {
            id   : 29,
            name : 'Sight Words - Lesson 19',
            src  : root+'/video/eEcSuinkI5Q-19.webm',
            thumb: root+'/video/eEcSuinkI5Q-19.png',
            dura : '6:16',
        },
        30: {
            id   : 30,
            name : 'Sight Words - Lesson 20',
            src  : root+'/video/eEcSuinkI5Q-20.webm',
            thumb: root+'/video/eEcSuinkI5Q-20.png',
            dura : '6:33',
        },
        31: {
            id   : 31,
            name : 'Making healthy choices',
            src  : root+'/video/U6GJMpg9dT4.webm',
            thumb: root+'/video/U6GJMpg9dT4.png',
            dura : '12:31',
        },
        32: {
            id   : 32,
            name : 'Do you have free time?',
            src  : root+'/video/ezgU4hsEA7U.mp4',
            thumb: root+'/video/ezgU4hsEA7U.png',
            dura : '9:11',
        },
    }
}
mock.kid_videos = nick => {
    return {
        pat: [
            1,
            2,
            3,
            4,
            31,         // Conversation: Making Healthy Choices
            32,         // Conversation: Do you have free time?
        ],
        nan: [
            1,
            2,
            7,
            8,
            11,         // 100 Opposite Words
            31,         // Conversation: Making Healthy Choices
            // 32,         // Conversation: Do you have free time?
        ],
        wa : [
            1,
            2,
            7,
            10,         // Sight Words 1/1
            12,         // Sight Words 1/2
            13,         // Sight Words 1/3
            // 14,         // Sight Words 1/4
            // 15,         // Sight Words 1/5
            // 16,         // Sight Words 1/6
            // 17,         // Sight Words 1/7
        ],
        nai: [
            3,
            4,
            5,
            6,
            9,
            10,         // Sight Words 1/1
        ],
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
