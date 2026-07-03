const express = require('express');
const router = express.Router();

const Model = require('../models/Event');
const User = require('../models/User');
const verifyToken = require('../utils/verifyToken');

const RSVP_STATUSES = ['Going', 'Not Going', 'Maybe'];

const canManageEvent = (event, user) => {
	if (!event || !user) {
		return false;
	}

	return user.role === 'admin' || String(event.CreatedBy) === String(user._id);
};

const populateEvent = (query) => query.populate('CreatedBy', 'name email avatar role').populate('registeredUsers.userId', 'name email avatar role');

const upsertRsvp = async (eventId, userId, status) => {
	const event = await Model.findById(eventId);

	if (!event) {
		return null;
	}

	const normalizedStatus = RSVP_STATUSES.includes(status) ? status : null;

	if (!normalizedStatus) {
		const error = new Error('Invalid RSVP status');
		error.statusCode = 400;
		throw error;
	}

	const existingRsvpIndex = event.registeredUsers.findIndex((entry) => String(entry.userId) === String(userId));

	if (existingRsvpIndex >= 0) {
		event.registeredUsers[existingRsvpIndex].status = normalizedStatus;
	} else {
		event.registeredUsers.push({ userId, status: normalizedStatus });
	}

	await event.save();
	return event;
};

router.post('/add', verifyToken, async (req, res) => {
	try {
		const payload = {
			...req.body,
			CreatedBy: req.user._id,
		};

		const event = await new Model(payload).save();
		res.status(201).json(event);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: 'Failed to create event' });
	}
});

router.get('/getall', async (req, res) => {
	try {
		const events = await populateEvent(Model.find());
		res.status(200).json(events);
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
});

router.get('/getbyid/:id', async (req, res) => {
	try {
		const event = await populateEvent(Model.findById(req.params.id));

		if (!event) {
			return res.status(404).json({ message: 'Event Not Found' });
		}

		res.status(200).json(event);
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
});

router.put('/update/:id', verifyToken, async (req, res) => {
	try {
		const event = await Model.findById(req.params.id);

		if (!event) {
			return res.status(404).json({ message: 'Event Not Found' });
		}

		if (!canManageEvent(event, req.user)) {
			return res.status(403).json({ message: 'Forbidden' });
		}

		const updatedEvent = await Model.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});

		res.status(200).json(updatedEvent);
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
});

router.delete('/delete/:id', verifyToken, async (req, res) => {
	try {
		const event = await Model.findById(req.params.id);

		if (!event) {
			return res.status(404).json({ message: 'Event Not Found' });
		}

		if (!canManageEvent(event, req.user)) {
			return res.status(403).json({ message: 'Forbidden' });
		}

		await Model.findByIdAndDelete(req.params.id);
		res.status(200).json({ message: 'Event deleted successfully' });
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
});

router.patch('/rsvp/:id', verifyToken, async (req, res) => {
	try {
		const event = await upsertRsvp(req.params.id, req.user._id, req.body.status);

		if (!event) {
			return res.status(404).json({ message: 'Event Not Found' });
		}

		res.status(200).json(event);
	} catch (error) {
		console.log(error);
		res.status(error.statusCode || 500).json(error.statusCode ? { message: error.message } : error);
	}
});

router.patch('/register/:id', verifyToken, async (req, res) => {
	try {
		const event = await upsertRsvp(req.params.id, req.user._id, 'Going');

		if (!event) {
			return res.status(404).json({ message: 'Event Not Found' });
		}

		res.status(200).json(event);
	} catch (error) {
		console.log(error);
		res.status(error.statusCode || 500).json(error.statusCode ? { message: error.message } : error);
	}
});

router.patch('/unregister/:id', verifyToken, async (req, res) => {
	try {
		const event = await upsertRsvp(req.params.id, req.user._id, 'Not Going');

		if (!event) {
			return res.status(404).json({ message: 'Event Not Found' });
		}

		res.status(200).json(event);
	} catch (error) {
		console.log(error);
		res.status(error.statusCode || 500).json(error.statusCode ? { message: error.message } : error);
	}
});

router.post('/comment/:id', verifyToken, async (req, res) => {
	try {
		const event = await Model.findById(req.params.id);

		if (!event) {
			return res.status(404).json({ message: 'Event Not Found' });
		}

		const user = await User.findById(req.user._id).select('name avatar email');

		event.CommentSchema.push({
			user: user?.name || user?.email || 'Guest',
			avatar: user?.avatar,
			text: req.body.text,
		});

		await event.save();
		res.status(201).json(event);
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
});

router.post('/timeline/:id', verifyToken, async (req, res) => {
	try {
		const event = await Model.findById(req.params.id);

		if (!event) {
			return res.status(404).json({ message: 'Event Not Found' });
		}

		if (!canManageEvent(event, req.user)) {
			return res.status(403).json({ message: 'Forbidden' });
		}

		event.timeline.push({
				title: req.body.title,
			description: req.body.description,
			status: req.body.status,
			timestamp: req.body.timestamp,
		});

		await event.save();
		res.status(201).json(event);
	} catch (error) {
		console.log(error);
		res.status(500).json(error);
	}
});

module.exports = router;
