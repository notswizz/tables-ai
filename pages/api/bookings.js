import { ObjectId } from 'mongodb';
import clientPromise from '../../utils/mongodb';

export default async (req, res) => {
  const client = await clientPromise;
  const database = client.db('tsa');
  const collection = database.collection('bookings');

  if (req.method === 'GET') {
    const { client: clientName, staff: staffName } = req.query;
    let filter = {};

    if (clientName) {
      filter.client = clientName;
    }

    if (staffName) {
      filter['staffNeeded.staffNames'] = staffName;
    }

    try {
      const data = await collection.find(filter).toArray();
      res.status(200).json(data);
    } catch (e) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'POST') {
    try {
      const booking = req.body;
      booking.staffNeeded = booking.staffNeeded.map(day => ({
        ...day,
        staffNames: day.staffNames ? day.staffNames.slice(0, day.staff) : []
      }));
      const result = await collection.insertOne(booking);
      res.status(201).json(result);
    } catch (e) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'PUT') {
    const { _id, ...updateData } = req.body;
    try {
      if (updateData.staffNeeded) {
        updateData.staffNeeded = updateData.staffNeeded.map(day => ({
          ...day,
          staffNames: day.staffNames ? day.staffNames.slice(0, day.staff) : []
        }));
      }
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
