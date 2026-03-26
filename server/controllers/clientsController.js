const Client = require('../models/Client');

exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(clients);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.createClient = async (req, res) => {
  const { name, email, phone, address } = req.body;
  try {
    const newClient = new Client({
      name, email, phone, address, userId: req.user.id
    });
    const client = await newClient.save();
    res.json(client);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateClient = async (req, res) => {
  const { name, email, phone, address } = req.body;
  const clientFields = { name, email, phone, address };

  try {
    let client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ msg: 'Client not found' });
    if (client.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    client = await Client.findByIdAndUpdate(req.params.id, { $set: clientFields }, { new: true });
    res.json(client);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteClient = async (req, res) => {
  try {
    let client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ msg: 'Client not found' });
    if (client.userId.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    await Client.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Client removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
