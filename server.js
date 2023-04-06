const express = require(`express`)
const app = express()
const cors = require(`cors`)
const path = require(`path`)

app.use(express.json())
app.use(cors())

// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: '427d399a124746a7bafa5b514ddaf99c',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')

const coffees = [`Latte`, `Machiato`, `Frappucino`]

app.get(`/`, (req, res) => {
        res.sendFile(path.join(__dirname,`/index.html`))
})

app.get(`/api/coffees`, (req, res) => {
    res.status(200).send(coffees)
})

app.post('/api/coffees', (req, res) => {
    
    console.log(req.body)
    let {order} = req.body

    const index = coffees.findIndex(coffee => {
    return coffee === order
})

try {
    if (index === -1 && order !== '') {
        coffees.push(order)
        rollbar.log(`Nice order!`)
        res.status(200).send(coffees)
    } else if (order === ''){
         rollbar.warning(`No mames, no order provided`)
         res.status(400).send('Please enter your order.')
     } else {
        rollbar.critical(`Dupe nukem, duplicate order attempted`)
        res.status(400).send('That order has already been inputted. Try something being original.')
    }
} catch (err) {
    console.log(err)
}

})

app.use(express.static(`${__dirname}/public`))

app.listen(4000, () => console.log(`server running on 4000`))