const express = require('express')

/*const uuid = require('uuid')*/
const app = express()
const port = (3001)

app.use(express.json())

const clients = []

const checkOrderId = (request, response, next) => {
    const { id } = request.params
    const index = clients.findIndex(client => client.id === id)
    const findOrder = clients.findIndex(client => client.id === id)

    if (index || findOrder < 0) {

        return response.status(404).json({ error: 'Not Found' })
    }

    request.orderIndex = index
    request.orderId = id
    next()

}

const checkUrl = (request, response, next) => {
    console.log(request.method)
    console.log(request.url)

    next()

}

app.post('/order', checkUrl, (request, response) => {

    const { order, clientName, price, status } = request.body

    const client = { id: uuid.v4(), order, clientName, price, status }

    clients.push(client)

    return response.status(201).json(client)

})

app.get('/order', checkUrl, (request, response) => {

    return response.json({ clients })

})

app.put('/order/:id', checkOrderId, checkUrl, (request, response) => {

    /*
    const {id} = request.params
    
    const index = clients.findIndex(client => client.id === id)
    
    if(index < 0){
    
        return response.status(404).json({error: 'not found'})
    }
    */

    const index = request.orderIndex
    const id = request.orderId
    const { order, clientName, price, status } = request.body
    const OrderUpdate = { id, order, clientName, price, status }

    clients[index] = OrderUpdate

    return response.json(OrderUpdate)

})

app.delete('order/:id', checkOrderId, checkUrl, (request, response) => {

    /* const { id } = request.params
   
   const index = clients.findIndex(client => client.id === id)

   if (index < 0) {
       return response.status(404).json({error: "Order not found"})
   }
   */

    const index = request.orderIndex

    clients.splice(index, 1)

    return response.json({ clients })

})

app.get('/order/:id', checkOrderId, checkUrl, (request, response) => {

    const { id } = request.params

    const findOrder = clients.find(client => client.id === id)

    return response.status(201).json(findOrder)

})

app.patch('/order/:id', checkOrderId, checkUrl, (request, response) => {

    const { id } = request.params

    const { order, clientName, price, status } = request.body

    const index = clients.findIndex(client => client.id === id)

    const readOrder = { id, order: clients[index].order, clientName: clients[index].clientName, 
    price: clients[index].price, status: 'Pronto' }

    return response.status(201).json(readOrder)


})


app.listen(port, () => {

    console.log(`👽 server started on port ${port}`)
})

