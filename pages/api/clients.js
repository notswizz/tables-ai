import { ObjectId } from 'mongodb';
import clientPromise from '../../utils/mongodb';

export default async (req, res) => {
  const client = await clientPromise;
  const database = client.db('tsa');
  const collection = database.collection('clients');

  if (req.method === 'GET') {
    try {
      const data = await collection.find({}).toArray();
      res.status(200).json(data);
    } catch (e) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'POST') {
    try {
      const result = await collection.insertOne(req.body);
      res.status(201).json(result);
    } catch (e) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'PUT') {
    const { _id, ...updateData } = req.body;
    try {
      const result = await collection.updateOne(
        { _id: new ObjectId(_id) },
        { $set: updateData }
      );
      res.status(200).json(result);
    } catch (e) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};
