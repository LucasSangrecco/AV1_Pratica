const express = require('express')
const mongoose = require('mongoose')
const Maps = require('./models/markers')

const app = express()

app.use(
    express.urlencoded({
        extended: true,
    })
)

app.use(express.json())

app.post('/newlocation', async (req,res) => {
    const { name, location } = req.body
    const markers = {
        name,
        location
    }
    try { 
        await Maps.create(markers)
        res.status(201).json({ message: 'Localização inserida no sistema com sucesso!' })
    } catch (error){
        res.status(500).json({ erro: error })
    }
})

app.get('/location', async (req, res) => {
    try {
      const markers = await Maps.find()
      res.status(200).json(markers)
    } catch (error) {
      res.status(500).json({ erro: error })
    }
})  

app.get('/location/:id', async (req, res) => {
    const id = req.params.id
    try {
      const markers = await Maps.findOne({ _id: id })
      if (!markers) {
        res.status(422).json({ message: 'Usuário não encontrado!' })
        return
      }
      res.status(200).json(markers)
    } catch (error) {
      res.status(500).json({ erro: error })
    }
})

app.patch('/updatelocation/:id', async (req, res) => {
    const id = req.params.id
    const { name, location } = req.body
    const markers = {
        name,
        location
    }
    try {
      const updatedlocation = await Maps.updateOne({ _id: id }, markers)
      if (updatedlocation.matchedCount === 0) {
        res.status(422).json({ message: 'Localização não encontrado!' })
        return
      }
      res.status(200).json(markers)
    } catch (error) {
      res.status(500).json({ erro: error })
    }
})

app.delete('/deletelocation/:id', async (req, res) => {
    const id = req.params.id
    const markers = await Maps.findOne({ _id: id })
    if (!markers) {
      res.status(422).json({ message: 'Localização não encontrado!' })
      return
    }
    try {
      await Maps.deleteOne({ _id: id })
      res.status(200).json({ message: 'Localização removida com sucesso!' })
    } catch (error) {
      res.status(500).json({ erro: error })
    }
}) 

app.get("/", (req, res) => {  
    res.json({ message: "Oi Express!" });
});

mongoose.connect(
    'mongodb+srv://sangrecco:VAgIFFlCNGWXTU4b@aulamongo.0ojpawn.mongodb.net/Maps?retryWrites=true&w=majority',
)

.then(() => {
    console.log('Conectou ao banco!')
    app.listen(3000)
})

.catch((err) => console.log(err))