exports.run = async (client, message, args) => {
  // Parse args
  let deleteCount = parseInt(args[0], 10)
  // Check if Delete Count is bigger than discord can handle
  if (deleteCount > 100) {
    // Delete only 100 messages
    deleteCount = 100
    // Notify user about this
    message.channel.send('Can handle only 100 messages. Deleting 100 messages').then(e => setTimeout(() => e.delete(), 2000))
  }
  // Delete only one message if not specified how many
  if (Number.isNaN(deleteCount)) deleteCount = 1
  // console.log([deleteCount, typeof (deleteCount)])
  try {
    // Delete user message
    await message.delete()
    // Fetch messages
    const fetched = await message.channel.messages.fetch({ limit: deleteCount })
    // Delete messages
    await message.channel.bulkDelete(fetched)
  } catch (error) {
    // Handle error
    message.reply(`Couldn't delete messages because of: ${ error }`)
    // Delete error message
      .then(el => setTimeout(() => el.delete(), 5000))
    // Exit function
    return 0
  }
  // Notify if success
  message.channel.send(`Successfully deleted ${ deleteCount } ${ deleteCount === 1 ? 'message' : 'messages' }.`).then(el => setTimeout(() => el.delete(), 3000))
  return 0
}
exports.help = {
  name: '`purge`',
  description: 'Delete messages',
  usage: 'purge `nubmer of messages to delete (default: 1)`'
}
