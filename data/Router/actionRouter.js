const express = require('express');
const Action = require('../helpers/actionModel.js');
const Projects = require('../helpers/projectModel.js');
const router = express.Router();

router.get('/', (req, res) => {
  Action.get()
    .then(actions => {
      res.status(200).json(actions);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: 'Error getting actions' });
    });
});

router.post('/', validatePost, (req, res) => {
  console.log('req.body', req.body);
  const data = req.body;
  Action.insert(data)
    .then(user => {
      res.status(201).json(user);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: 'Error inserting post' });
    });
});

router.put('/:id', validateUserId, validatePost, (req, res) => {
  const { id } = req.params;
  const { project_id, description, notes } = req.body;
  Action.update(id, { project_id, description, notes })
    .then(updated => {
      Action.get(id)
        .then(post => res.status(200).json(post))
        .catch(error => {
          console.log(error);
          res.status(500).json({ error: 'Error getting action ' });
        });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: 'Error in updating action ' });
    });
});

router.delete('/:id', validateUserId, (req, res) => {
  const { id } = req.params;
  Action.remove(id)
    .then(action => {
      res.status(200).json({ message: 'Successfully deleted this action' });
    })
    .catch(() => {
      res.status(500).json({ errorMessage: 'Could not delete this action' });
    });
});

//custom middleware
function validateUserId(req, res, next) {
  const { id } = req.params;
  Action.get(id)
    .then(action => {
      if (action) {
        req.action = action;
        next();
      } else {
        res.status(404).json({ erro: 'Actions with id does not exist ' });
      }
    })
    .catch(() => {
      res.status(500).json({ errorMessage: 'Not working check for valid id' });
    });
}

function validatePost(req, res, next) {
  const { project_id, description, notes } = req.body;
  if (!project_id) {
    return res.status(400).json({ error: 'Action requires project id' });
  }
  if (!description) {
    return res
      .status(400)
      .json({ error: 'Action requires project description' });
  }
  if (!notes) {
    return res.status(400).json({ error: 'Action requires project notes' });
  }
  next();
}

module.exports = router;
