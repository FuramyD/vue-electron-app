const PDFDocument = require('pdfkit');
const fs = require('fs');
const mongoose = require('mongoose')

let [,, path] = process.argv
if (!path) path = ''
const resultSchema = mongoose.Schema({
    id: Number,
    name: String,
    tries: Number,
    scriptId: Number,
    lastEnter: String
})

const resultModel = mongoose.model('Result', resultSchema)

const unknown = '�'

// Create a document
const doc = new PDFDocument();
const stream = doc.pipe(fs.createWriteStream(`${path}/results.pdf`));

doc.font('Times-Roman');


async function start() {
    await mongoose.connect(
        'mongodb+srv://Furamy:pass123@cluster0.buzs6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
        { useUnifiedTopology: true }
    )

    const results = await resultModel.find()
    // console.log(results)

    doc
        .font(__dirname + '/fonts/Roboto-Regular.ttf')
        .fontSize(24)
        .text(toCenter('All results', 66))

    row(doc, 100)

    doc.fontSize(14)

    let topGap = 0
    let leftRows = results.length
    const rowsOnPage = 24
    const keys = ['id', 'name', 'scriptId', 'lastEnter', 'tries']
    let countOfAdditionalGaps = 0
    for (let i = 0; i < keys.length; i++) {
        textInRow(doc, keys[i], 100 + topGap*20, i+1)
    }
    if (leftRows < 27) {
        setColumns(doc, results.length + 1, 100)
    } else {
        setColumns(doc, rowsOnPage + 1, 100)
    }
    for (let i = 0; i < results.length; i++) {
        const result = results[i]
        let additionalGap = 0

        for (let j = 0; j < keys.length; j++) {
            if (result[keys[j]].length > 20 * (additionalGap + 1)) {
                let value = result[keys[j]].toString().replace(new RegExp(unknown, 'g'), '').split('')
                value.splice(19, 0, '\n')
                value = value.join('')
                textInRow(doc, value, 120 + topGap*20, j+1)
                additionalGap++
                countOfAdditionalGaps++
                continue
            }
            // console.log('val', result[keys[j]])
            let val = result[keys[j]].toString().replace(new RegExp(unknown, 'g'), '')
            textInRow(doc, val, 120 + topGap*20, j+1)
        }
        row(doc, 120 + topGap*20, 20 * (additionalGap+1))
        topGap += additionalGap + 1
        if (topGap % 50 === rowsOnPage) {
            doc.addPage()
            leftRows -= rowsOnPage
            if (leftRows < rowsOnPage) {
                console.log(leftRows)
                setColumns(doc, leftRows + countOfAdditionalGaps + 1)
            } else {
                console.log(false)
                setColumns(doc, rowsOnPage)
            }
            topGap = 0
        }
        // doc.fontSize(14).text(
        //     toCenter(result['id'], 15) + toCenter(result['name'], 20) + toCenter(result['scriptId'], 15) +
        //     toCenter(result['lastEnter'], 40) + toCenter(result['tries'], 10)
        // )

    }
}

start().then(r => {
    doc.end();
    mongoose.disconnect()
    console.log('end')
})


function textInRow(doc, text, heigth, column) {

    const columnsX = [30, 100, 250, 320, 480]

    doc.y = heigth;
    doc.x = columnsX[column - 1];
    doc.fillColor('black')
    doc.text(text, {
        paragraphGap: 5,
        indent: 5,
        align: 'justify',
        columns: 1,
    });
    return doc
}




function row(doc, heigth, size = 20) {
    doc.lineJoin('miter')
        .rect(30, heigth, 500, size)
        .stroke()
    return doc
}

function setColumns(doc, columns, startHeight = 120) {
    doc.lineCap('butt')
        .moveTo(100, startHeight)
        .lineTo(100, startHeight + columns * 20)
        .moveTo(250, startHeight)
        .lineTo(250, startHeight + columns * 20)
        .moveTo(320, startHeight)
        .lineTo(320, startHeight + columns * 20)
        .moveTo(480, startHeight)
        .lineTo(480, startHeight + columns * 20)
        .stroke()
}

function toCenter(str, length) {
    let newStr = ''

    if (length < str.length) return str
    if (str.length === length) return str

    let spaces = parseInt((length - str.length) / 2)

    for (let i = 0; i < spaces; i++) {
        newStr += ' '
    }
    newStr += str
    for (let i = 0; i < spaces; i++) {
        newStr += ' '
    }

    return newStr
}
