//chama o express após ser instalado no terminal
const express = require('express')

//chama o bodyParser após ser instalado no terminal
const bodyParser = require('body-parser')
//habilita o request

const request = require('request')
//habilita a requisição https

const https = require('https')

// define express como app
const app = express()

app.use(express.static('public'))

//sintaxe padrão pro bodyParser funcionar (decorar)
app.use(bodyParser.urlencoded({ extended: true }))

//app.get chama a página a ser criada no servidor com função de request(req) e respond(res)
app.get('/', function (req, res) {
    //respond.send ou res.send envia o que tiver entre () para o servidor // sendFile envia um arquivo
    res.sendFile(__dirname + '/index.html')
})

//app.post está vinculado com o form action '/' e method 'post' no HTML. Envia as informações do html
app.post('/', function (req, res) {
    // req.body seleciona as informações do html pelo 'name' e armazena. Como se fosse o querySelector
    const firstName = req.body.fName
    const lastName = req.body.lName
    const email = req.body.email

    //cria as informações a serem envidas via API, utilizando os parametros que a API utiliza ex: email_address é um parametro fixo da API
    const data = {
        members: [{
            email_address: email,
            status: 'subscribed',
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    }
    //converte as informações da variável data para JSON
    const jsonData = JSON.stringify(data)

    //armazena a URL da API para ser utilizada em https.request
    const url = 'https://us21.api.mailchimp.com/3.0/lists/0fd541aff9'

        //armazena options da API para ser utilizada em https.request
    const options = {
        method: 'POST',
        auth: 'Lucas1:89a885ab232531e38fada373c9e194ac-us21' //us21 é o nome do servidor reservado pela API para armazenar os dados, ao criar a key, é gerado automatico
    }

    const request = https.request(url, options, function (response) {
        // se o código de Status da requisição for = 200 (bem sucedido), envia o arquivo success.html se não, envia o arquivo de que deu erro, para tentar novamente
        if (response.statusCode === 200) {
            res.sendFile(__dirname + '/success.html')
        } else {
            res.sendFile(__dirname + '/failure.html')
        }

        //isso aqui n sei n
        response.on('data', function (data) {
            console.log(JSON.parse(data))
        })
    })
    //envia as informações criadas em jsonData para a API
    request.write(jsonData)
    //finaliza a requisição
    request.end()
})


//sintaxe padrão para criar o servidor na porta mencionada, ex: porta 3000
app.listen(process.env.PORT || 3000, function () {
    console.log('Server started on port 3000')
})

