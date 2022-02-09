import AppBar from '@mui/material/AppBar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import ProfileForm from '../components/ProfileForm';

function AboutTab() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('/api/profile').then((res) => {
      if (res.data.success) {
        setData(res.data.user);
      }
    });
  }, []);

  if (!data) {
    return null;
  }

  const container = {
    show: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show">
      <div className="md:flex max-w-2xl">
        <div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32">
          <Card component={motion.div} variants={item} className="w-full mb-32 rounded-16 shadow">
            <AppBar position="static" elevation={0}>
              <Toolbar className="px-8">
                <Typography
                  variant="subtitle1"
                  color="inherit"
                  className="flex-1 px-12 font-medium"
                >
                  General Information
                </Typography>
              </Toolbar>
            </AppBar>
            <CardContent>
              <ProfileForm item={data} />
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}

export default AboutTab;
