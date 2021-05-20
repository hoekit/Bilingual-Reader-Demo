// js/vReader.js

let mBook = [
  [
    [
      {
        "class": "chapter-number",
        "ptr": "0.0.0",
        "str": "บทที่หนึ่ง /"
      },
      {
        "class": "chapter-number",
        "ptr": "0.0.1",
        "str": "บทที่ /One"
      },
      {
        "class": "chapter-number",
        "ptr": "0.0.2",
        "str": " /Chapter One"
      }
    ],
    [
      {
        "class": "chapter-title",
        "ptr": "0.1.0",
        "str": "ความประหลาดใจที่ยอดเยี่ยม /"
      },
      {
        "class": "chapter-title",
        "ptr": "0.1.1",
        "str": "ความประหลาดใจที่ /Great"
      },
      {
        "class": "chapter-title",
        "ptr": "0.1.2",
        "str": " /A Great Surprise"
      }
    ],
    [
      {
        "class": "paragraph-start",
        "ptr": "0.2.0",
        "str": "\"แม่คุณได้ยินเรื่องวันหยุดฤดูร้อนของเราหรือยัง?\" จูเลียนพูด, ที่โต๊ะอาหารเช้า. /"
      },
      {
        "class": "paragraph-start",
        "ptr": "0.2.1",
        "str": "\"แม่คุณได้ยินเรื่องวันหยุดฤดูร้อนของเราหรือยัง?\" จูเลียนพูด, ที่โต๊ะ /breakfast."
      },
      {
        "class": "paragraph-start",
        "ptr": "0.2.2",
        "str": "\"แม่คุณได้ยินเรื่องวันหยุดฤดูร้อนของเราหรือยัง?\" จูเลียนพูด, ที่ /breakfast-table."
      },
      {
        "class": "paragraph-start",
        "ptr": "0.2.3",
        "str": "\"แม่คุณได้ยินเรื่องวันหยุดฤดูร้อนของเราหรือยัง?\" จูเลียนพูด, /at the breakfast-table."
      },
      {
        "class": "paragraph-start",
        "ptr": "0.2.4",
        "str": "\"แม่คุณได้ยินเรื่องวันหยุดฤดูร้อนของเราหรือยัง?\" จูเลียน /said, at the breakfast-table."
      },
      {
        "class": "paragraph-start",
        "ptr": "0.2.5",
        "str": "\"แม่คุณได้ยินเรื่องวันหยุดฤดูร้อนของเราหรือยัง?\" /said Julian, at the breakfast-table."
      },
      {
        "class": "paragraph-start",
        "ptr": "0.2.6",
        "str": "\"แม่คุณได้ยินเรื่องวันหยุดฤดูร้อนของเรา /yet?\" said Julian, at the breakfast-table."
      },
      {
        "class": "paragraph-start",
        "ptr": "0.2.7",
        "str": "\"แม่คุณได้ยินเรื่องวันหยุด /summer /ของเรา /yet?\" said Julian, at the breakfast-table."
      },
      {
        "class": "paragraph-start",
        "ptr": "0.2.8",
        "str": "\"แม่คุณได้ยินเรื่อง /summer holidays /ของเรา /yet?\" said Julian, at the breakfast-table."
      },
      {
        "class": "paragraph-start",
        "ptr": "0.2.9",
        "str": "\"แม่คุณได้ยินเรื่อง /our summer holidays yet?\" said Julian, at the breakfast-table."
      },
      {
        "class": "paragraph-start",
        "ptr": "0.2.10",
        "str": "\"แม่คุณได้ยิน /about our summer holidays yet?\" said Julian, at the breakfast-table."
      },
      {
        "class": "paragraph-start",
        "ptr": "0.2.11",
        "str": "\"แม่คุณ /heard about our summer holidays yet?\" said Julian, at the breakfast-table."
      },
      {
        "class": "paragraph-start",
        "ptr": "0.2.12",
        "str": "\"แม่ /have you heard about our summer holidays yet?\" said Julian, at the breakfast-table."
      },
      {
        "class": "paragraph-start",
        "ptr": "0.2.13",
        "str": " /\"Mother, have you heard about our summer holidays yet?\" said Julian, at the breakfast-table."
      }
    ],
    [
      {
        "class": "",
        "ptr": "0.3.0",
        "str": "\"เราไปชายหาดตามปกติได้ไหม\" /"
      },
      {
        "class": "",
        "ptr": "0.3.1",
        "str": " /\"Can /เราไปชายหาดตามปกติ?\""
      },
      {
        "class": "",
        "ptr": "0.3.2",
        "str": " /\"Can /เราไป /beach as usual?\""
      },
      {
        "class": "",
        "ptr": "0.3.3",
        "str": " /\"Can /เรา /go to the beach as usual?\""
      },
      {
        "class": "",
        "ptr": "0.3.4",
        "str": " /\"Can we go to the beach as usual?\""
      }
    ],
    [
      {
        "class": "paragraph-start",
        "ptr": "0.4.0",
        "str": "\"ฉันคิดว่าไม่\" แม่ของเขาพูด /"
      },
      {
        "class": "paragraph-start",
        "ptr": "0.4.1",
        "str": "\"ฉันคิดว่าไม่\" แม่ของเขา /said."
      },
      {
        "class": "paragraph-start",
        "ptr": "0.4.2",
        "str": "\"ฉันคิดว่าไม่\" /mother /ของเขา /said."
      },
      {
        "class": "paragraph-start",
        "ptr": "0.4.3",
        "str": "\"ฉันคิดว่าไม่\" /his mother said."
      },
      {
        "class": "paragraph-start",
        "ptr": "0.4.4",
        "str": "\"ฉันคิดว่า /not\" his mother said."
      },
      {
        "class": "paragraph-start",
        "ptr": "0.4.5",
        "str": " /\"I /คิดว่า /not\" his mother said."
      },
      {
        "class": "paragraph-start",
        "ptr": "0.4.6",
        "str": " /\"I'm afraid not\" his mother said."
      }
    ],
    [
      {
        "class": "",
        "ptr": "0.5.0",
        "str": "\"พวกเขาค่อนข้างเต็มในปีนี้\" /"
      },
      {
        "class": "",
        "ptr": "0.5.1",
        "str": "\"พวกเขาค่อนข้างเต็มใน /year /นี้.\""
      },
      {
        "class": "",
        "ptr": "0.5.2",
        "str": "\"พวกเขาค่อนข้างเต็มใน /this year.\""
      },
      {
        "class": "",
        "ptr": "0.5.3",
        "str": "\"พวกเขา /quite /เต็มใน /this year.\""
      },
      {
        "class": "",
        "ptr": "0.5.4",
        "str": "\"พวกเขา /quite full this year.\""
      },
      {
        "class": "",
        "ptr": "0.5.5",
        "str": " /\"They are quite full this year.\""
      }
    ]
  ],
  [
    [
      {
        "class": "chapter-number",
        "ptr": "1.0.0",
        "str": "บทที่สอง /"
      },
      {
        "class": "chapter-number",
        "ptr": "1.0.1",
        "str": "บทที่ /Two"
      },
      {
        "class": "chapter-number",
        "ptr": "1.0.2",
        "str": "Chapter Two"
      }
    ],
    [
      {
        "class": "chapter-title",
        "ptr": "1.1.0",
        "str": "ลูกพี่ลูกน้องที่แปลกประหลาด /"
      },
      {
        "class": "chapter-title",
        "ptr": "1.1.1",
        "str": "ลูกพี่ลูกน้องที่ /Strange"
      },
      {
        "class": "chapter-title",
        "ptr": "1.1.2",
        "str": " /The Strange Cousin"
      }
    ],
    [
      {
        "class": "",
        "ptr": "1.2.0",
        "str": "ป้าของเด็ก ๆ คอยเฝ้ารถ /"
      },
      {
        "class": "",
        "ptr": "1.2.1",
        "str": "ป้าของเด็ก ๆ คอยเฝ้า/ the car."
      },
      {
        "class": "",
        "ptr": "1.2.2",
        "str": "ป้าของเด็ก ๆ คอย/ watching for the car."
      },
      {
        "class": "",
        "ptr": "1.2.3",
        "str": "ป้าของเด็ก ๆ /had been watching for the car."
      },
      {
        "class": "",
        "ptr": "1.2.4",
        "str": "ป้าของ /the children had been watching for the car."
      },
      {
        "class": "",
        "ptr": "1.2.5",
        "str": " /aunt /ของ /the children had been watching for the car."
      },
      {
        "class": "",
        "ptr": "1.2.6",
        "str": " /The children's aunt had been watching for the car."
      }
    ]
  ]
]

var Reader = {
    book: mBook,
    _ptr: '0.0.0',
    prev_ptr: undefined,
    next_ptr: '#0.0.1',
    view: function() {
        return m("div.main", [
            m.trust(Reader.html()),
            m('footer',[
                m('div.dib.w-20',[
                    m('a',{href:"./credits.html"},'Credits'),
                ]),
                m('div.dib.w-75',[
                    m('a#prevPtr',{href:Reader.prev_ptr,onclick:Reader.prev},'Prev'),
                    //m.trust('<a id="prevPtr" href="./reader.html?ptr=0.2.3">Prev</a>'),
                    ' | ',
                    m('a#nextPtr',{href:Reader.next_ptr,onclick:Reader.next},'Next'),
                    //m.trust('<a id="nextPtr" href="./reader.html?ptr=0.2.5">Next</a>'),
                ]),

            ])
        ])
    }
}

/*** Reader._chapter_dlines(ch_idx) :> Array

This method fetches the default dlines for the given chapter.

**/
Reader._chapter_dlines = ch_idx => {

    let chapter = Reader.book[ch_idx]      // chapter being pointed to
    let res = []                            // Result container

    chapter.map(dset => {                   // Iterate over all Dlinesets in chapter
        res.push(dset[dset.length - 1])     // Store default/target dline in result
    })

    return res
}

/*** Reader._dlineset_at(ch_idx,dset_idx) :> Array

This method fetches the dlineset for the given chapter and dlineset indices.

**/
Reader._dlineset_at = (ch_idx,dset_idx) => {
    return Reader.book[ch_idx][dset_idx]
}

/*** Reader.html() :> HTML

This method returns the HTML for a given pointer.

**/
Reader.html = () => {
    let [ch_idx, dset_idx, dline_idx] = Reader.get_ptr().split('.')

    // Regex that matches other locations in the same dlineset
    //   e.g. '0.1.2' will match qr/^0\.1\.\d+$/
    let curr_dlineset_re = ch_idx+'.'+dset_idx+'.'

    // Use the chapter Dline, except if the Dline is in the same Dlineset
    // as the pointer, use the pointed to Dline
    let htmls = Reader._chapter_dlines(ch_idx).map(ch_dline => {
        let loc = ch_dline.ptr
        let pointed = loc.match(curr_dlineset_re) ? 1 : 0;
        let dline = pointed
                  ? Reader.book[ch_idx][dset_idx][dline_idx]
                  : ch_dline

        // The dset_ptr is a pointer to the start of the dlineset.
        // It is rendered in the data-ptr attribute of the span and is
        // used to navigate to the dlineset
        let dset_ptr = ch_dline.ptr.replace(/\.\d+$/,'.0')

        // Render Dline depending on whether it is pointed to
        return pointed ? Reader._render_pointed(dline.class, dline.str, dset_ptr)
                       : Reader._render_normal(dline.class, dline.str, dset_ptr)
    })

    // Render to HTML
    let html = htmls.join('')

    // console.log("\n${html}\n");
    return html;
}

Reader.prev = () => {
    // console.log('Reader.prev called')
    if (!Reader.prev_ptr) { return }
    Reader.set_ptr(Reader.prev_ptr.replace('#',''))
}
Reader.next = () => {
    // console.log('Reader.next called')
    if (!Reader.next_ptr) { return }
    Reader.set_ptr(Reader.next_ptr.replace('#',''))
}

/*** Reader.set_ptr(ptr) :> Reader

This method sets the pointer to the given pointer and updates the
Reader.prev_ptr and Reader.next_ptr properties.

 **/
Reader.set_ptr = ptr => {
    // console.log('Reader.set_ptr called: '+ptr)
    Reader._ptr = ptr

    // Update next_ptr
    //   If next_ptr is undefined, the Next link is unclickable
    let next = Reader.the_next_ptr()
    Reader.next_ptr = next ? '#'+next : next

    // Update prev_ptr
    //   If prev_ptr is undefined, the Prev link is unclickable
    let prev = Reader.the_prev_ptr()
    Reader.prev_ptr = prev ? '#'+prev : prev

    return Reader
}
Reader.get_ptr = () => Reader._ptr

Reader.the_next_ptr = () => {   // :> undef | ptr
    if (typeof(Reader.get_ptr()) === "undefined") { return undef }
    let [ch_idx, dset_idx, dline_idx] = Reader.get_ptr().split('.')

    let max_chapter_idx
        = Reader.book.length - 1
    let max_chapter_dlineset_idx
        = Reader.book[ch_idx].length - 1
    let max_chapter_dlineset_dline_idx
        = Reader.book[ch_idx][dset_idx].length - 1

    // Case 1: NOT end of current dlineset
    //   Return pointer to next dline in dlineset
    if (dline_idx < max_chapter_dlineset_dline_idx) {
        return [ch_idx, dset_idx, Number(dline_idx)+1].join('.')
    }

    // Case 2: End of current dlineset, NOT end of dlinesets in chapter
    //   Return pointer to first dline in next dlineset
    if (dset_idx < max_chapter_dlineset_idx) {
        return [ch_idx, Number(dset_idx)+1, 0].join('.')
    }

    // Case 3: End of chapter dlineset, NOT end of chapters in book
    //   Return pointer to first dline in next chapter
    if (ch_idx < max_chapter_idx) {
        return [Number(ch_idx)+1, 0, 0].join('.')
    }

    // Case 4: End of book chapters
    //   Return undef
    return undefined;
}
Reader.the_prev_ptr = () => {   // :> undef | ptr
    if (typeof(Reader.get_ptr()) === "undefined") { return undef }
    let [ch_idx, dset_idx, dline_idx] = Reader.get_ptr().split('.')

    let max_chapter_idx
        = Reader.book.length - 1

    // Case 1: NOT at first Dline in current Dlineset
    //   Return pointer to prev dline in Dlineset
    if (dline_idx > 0) {
        return [ch_idx, dset_idx, Number(dline_idx)-1].join('.')
    }

    // Case 2: At first Dline in current Dlineset, NOT at first Dlineset in Chapter
    //   Return pointer to prev Dlineset in Chapter
    if (dset_idx > 0) {
        let Curr_chapter_Prev_dlineset_Max_dline_idx
            = Reader.book[ch_idx][dset_idx-1].length - 1
        return [ch_idx, dset_idx-1, Curr_chapter_Prev_dlineset_Max_dline_idx]
               .join('.')
    }

    // Case 3: At first Dlineset in chapter, NOT at first Chapter
    //   Return pointer to last Dline in last Dlineset in prev Chapter
    if (ch_idx > 0) {
        let Prev_chapter_Max_dlineset_idx
            = Reader.book[ch_idx-1].length - 1
        let Prev_chapter_Max_dlineset_Max_dline_idx
            = Reader.book[ch_idx-1][Prev_chapter_Max_dlineset_idx].length - 1
        return [ ch_idx-1,
                 Prev_chapter_Max_dlineset_idx,
                 Prev_chapter_Max_dlineset_Max_dline_idx
               ].join('.')
    }

    // Case 4: At start of book
    return undefined
}

Reader._render_normal = (klass,ostr,ptr) => {

    let str = ostr.replace(/^ \//,'')   // Remove language mark
        .replace(/$/,' ')     // Add a space at the end of the line

    if (klass === 'chapter-number') {
        return `\n  <h1 data-ptr="${ptr}" class="${klass}">${str}</h1>\n`
    }

    if (klass === 'chapter-title') {
        return `\n  <h2 data-ptr="${ptr}" class="${klass}">${str}</h2>`
    }

    if (klass === 'paragraph-start') {
        return `\n\n  <br/><span data-ptr="${ptr}" class="${klass}">${str}</span>`
    }

    return `<span data-ptr="${ptr}">${str}</span>`;
}
Reader._render_pointed = (klass,ostr,ptr) => {
    let seg_class = ''

    let spans = ostr.split(' /').map(seg => {
        // Toggles segment class.
        //   One of: 'src-lang'|''. Init value: 'src-lang'.
        seg_class = seg_class === '' ? 'src-lang' : ''

        // If segment class is src-lang, return a span, else as is
        let span = seg_class ? `<span class="${seg_class}">${seg} </span>` : seg

        // Return span only if segment is non-empty, else empty string
        return seg ? span : ''
    })

    let wrapped = '<span id="Ptr" class="pointed">'+spans.join('')+"</span>"

    return Reader._render_normal(klass,wrapped,ptr)
}

