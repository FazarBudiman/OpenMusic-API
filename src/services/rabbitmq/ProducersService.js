/* eslint-disable class-methods-use-this */
const amqp = require('amqplib');

class ProducersService {
  async sendMessage(_queue, _message) {
    const connection = amqp.connect(process.env.RABBITMQ_SERVER);
    const channel = (await connection).createChannel();

    (await channel).assertQueue(_queue, {
      durable: true,
    });

    (await channel).sendToQueue(_queue, Buffer.from(_message));
  }
}

module.exports = ProducersService;
