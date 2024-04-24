var express = require('express');
var router = express.Router();
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST

const Project=require('../models/project');
    
//Any requests to this controller must pass through this 'use' function
//Copy and pasted from method-override
router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}))
// Glavna stranica
router.get('/', function(req, res) {
  res.render('index', { title: 'Dobrodošli' });
});
//Dohvacanje svih projekata
router.get('/projects', async(req,res) =>
{
  try
  {
    const projects = await Project.find();
    res.render('projects/index',{title:"Projekti",projects});
  }
  catch(err)
  {
    res.status(500).send(err.message);
  }
});
//Ruta za stvaranje novog projekta
router.get('/project/new',async (req,res)=>
{
  res.render('projects/new', {title: 'Novi projekt'});
})


router.post('/project',async(req,res)=>
{
  const { name, description, price, tasks,teamMembers, jobDone, startDate, endDate}=req.body;

  const newProject= new Project(
    {
      name,
      description,
      price,
      tasks,
      teamMembers,
      jobDone,
      startDate,
      endDate,
    }
  );

  try
  {
    const savedProject = await newProject.save();
    res.format({
    html: function(){
        res.location('projects');
        res.redirect("/projects");
    },
    json: function(){
        res.json(savedProject);
    }
    });
  }
  catch(err)
  {
    res.status(400).send(err.message);
  }
});




//Azuriranja projekta
router.get('/project/:id/edit',async(req,res)=>
{
  const ProjectID=req.params.id;
  try
  {
    const project=await Project.findById(ProjectID);
    if(!project)
    {
      return res.status(404).send("Projekt nije pronađen");
    }
    res.render('projects/edit',{project});
  }
  catch(err)
  {
    res.status(500).send('Greška:${err.message}');
  }
});


//
router.put('/project/:id',async(req,res)=>
{
  const projectId=req.params.id;
  try
  {
    const updateProject= await Project.findByIdAndUpdate(projectId,
    req.body,
    {new:true, runValidatiors:true});
    if(!updateProject)
    {
      res.status(404).send("Projekt nije pronađen");
    }
    res.format({
      html: function(){
          res.location('projects');
          res.redirect("/projects");
      },
      json: function(){
          res.json(savedProject);
      }
      });
  }
  catch(error)
  {
    res.status(500).send("Greška: ${error.message}");
  }
});

//Prikaz detalja projekta
router.get('/project/:id/show',async(req,res)=>
{
  const ProjectID=req.params.id;
  try
  {
    const project=await Project.findById(ProjectID);
    if(!project)
    {
      return res.status(404).send("Projekt nije pronađen");
    }
    res.render('projects/show',{project});
  }
  catch(err)
  {
    res.status(500).send('Greška:${err.message}');
  }
});

//Brisanje projekta
router.delete('/projects/:id',async(req,res)=>
{
  const projectId=req.params.id;

  if(!mongoose.Types.ObjectId.isValid(projectId))
  {
    return res.status(400).send("Nevažeći ID");
  }
  try
  {
    const deletedProject= await Project.findByIdAndDelete(req.params.id);
    if(!deletedProject)
    {
      return res.status(404).send('Project not found');
    }
    res.format({
    html: function(){
        res.redirect("/projects");
    },
    json: function(){
        res.json(savedProject);
    }
    });
  }
  catch(error)
  {
    res.status(500).send(error.message);
  }
});
module.exports = router;
