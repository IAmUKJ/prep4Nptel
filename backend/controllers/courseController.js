import axios from 'axios';

export const getCourses = async (req, res) => {
  try {
    const response = await axios.get('https://api.nptelprep.in/courses', {
      headers: {
        'X-API-Key': process.env.NPTEL_API_KEY
      }
    });

    // Send the courses data from the NPTEL API response to the frontend
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching courses:', error.message);
    res.status(500).json({ message: 'Failed to fetch courses' });
  }
};

export const getCourseMaterials = async (req, res) => {
  const { courseCode } = req.params;
  console.log(courseCode);
  try {
    const response = await axios.get(`https://api.nptelprep.in/courses/${courseCode}`, {
      headers: {
        'X-API-Key': process.env.NPTEL_API_KEY
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching course materials:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to fetch course materials' });
  }
};
// NEW: get assignments for a course (from course details)
export const getCourseAssignments = async (req, res) => {
  const { courseCode } = req.params;
  try {
    const response = await axios.get(`https://api.nptelprep.in/courses/${courseCode}`, {
      headers: {
        'X-API-Key': process.env.NPTEL_API_KEY
      }
    });

    const courseData = response.data;
    // Assignments are inside courseData.assignments
    if (!courseData.assignments) {
      return res.status(404).json({ message: 'Assignments not found for this course' });
    }

    res.json({ assignments: courseData.assignments });
  } catch (error) {
    console.error('Error fetching course assignments:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to fetch course assignments' });
  }
};