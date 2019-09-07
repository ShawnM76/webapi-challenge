const express = require('express');
const Project = require('../helpers/projectModel.js');
const router = express.Router();

router.get('/', (req, res) => {
  Project.get()
    .then(projects => {
      res.status(200).json(projects);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: 'Error getting projects' });
    });
});

router.post('/', validatePost, (req, res) => {
  const data = req.body;
  Project.insert(data)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: 'Error inserting post' });
    });
});

router.put('/:id', validateId, validatePost, (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  Project.update(id, { name, description })
    .then(updated => {
      Project.get(id)
        .then(post => res.status(200).json(post))
        .catch(error => {
          console.log(error);
          res.status(500).json({ error: 'Error getting project ' });
        });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: 'Error in updating project ' });
    });
});

router.delete('/:id', validateId, (req, res) => {
  const { id } = req.params;
  Project.remove(id)
    .then(() => res.status(204).end())
    .catch(() =>
      res.status(500).json({ errorMessage: 'Could not delete this project ' }),
    );
});

router.get('/:id/actions', validateId, (req, res) => {
  const { id } = req.params;
  Project.getProjectActions(id)
    .then(project => {
      res.status(200).json(project);
    })
    .catch(() => {
      res.status(500).json({ errorMessage: "Couldn't get project actions" });
    });
});

// custom middleware
function validateId(req, res, next) {
  const { id } = req.params;
  Project.get(id).then(post => {
    if (post) {
      req.post = post;
      next();
    } else {
      res.status(404).json({ error: 'Post with id does not exist ' });
    }
  });
}

function validatePost(req, res, next) {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Post requires name.' });
  }
  if (!description) {
    return res.status(400).json({ error: 'Post requires description' });
  }
  next();
}

module.exports = router;
