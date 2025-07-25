"use client";
import React, { useState } from 'react';
// just test
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  Container,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Article,
  Category,
  LocalOffer,
  Comment,
  Dashboard,
} from '@mui/icons-material';
import BlogPostsTable from '@/app/components/admin/blog/BlogPostsTable';
import PostFormDrawer from '@/app/components/admin/blog/PostFormDrawer';
import CategoriesManagement from '@/app/components/admin/blog/CategoriesManagement';
import TagsManagement from '@/app/components/admin/blog/TagsManagement';
import CommentsManagement from '@/app/components/admin/blog/CommentsManagement';
import BlogStats from '@/app/components/admin/blog/BlogStats';
import { BlogPost } from '@/app/stores/blogStore';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`blog-tabpanel-${index}`}
      aria-labelledby={`blog-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `blog-tab-${index}`,
    'aria-controls': `blog-tabpanel-${index}`,
  };
}

export default function BlogPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [tabValue, setTabValue] = useState(0);
  const [postFormOpen, setPostFormOpen] = useState(false);
  const [editPost, setEditPost] = useState<BlogPost | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAddPost = () => {
    setEditPost(null);
    setPostFormOpen(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditPost(post);
    setPostFormOpen(true);
  };

  const handleViewPost = (post: BlogPost) => {
    // You can implement post preview logic here
    console.log('View post:', post);
  };

  const handleClosePostForm = () => {
    setPostFormOpen(false);
    setEditPost(null);
  };

  const tabs = [
    {
      label: 'Overview',
      icon: <Dashboard />,
      component: <BlogStats />,
    },
    {
      label: 'Posts',
      icon: <Article />,
      component: (
        <BlogPostsTable
          onAdd={handleAddPost}
          onEdit={handleEditPost}
          onView={handleViewPost}
        />
      ),
    },
    {
      label: 'Categories',
      icon: <Category />,
      component: <CategoriesManagement />,
    },
    {
      label: 'Tags',
      icon: <LocalOffer />,
      component: <TagsManagement />,
    },
    {
      label: 'Comments',
      icon: <Comment />,
      component: <CommentsManagement />,
    },
  ];

  return (
    <Container maxWidth="xl" className="py-6">
      {/* Page Header */}
      <Box className="mb-6">
        <Typography variant="h4" className="font-bold text-gray-800 mb-2">
          Blog Management
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Manage your blog posts, categories, tags, and comments from this comprehensive dashboard.
        </Typography>
      </Box>

      {/* Main Content */}
      <Paper 
        elevation={0} 
        className="min-h-[calc(100vh-200px)] bg-white border border-gray-200"
      >
        {/* Tabs Navigation */}
        <Box className="border-b border-gray-200 bg-gray-50">
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons={isMobile ? "auto" : false}
            className="px-4"
            TabIndicatorProps={{
              style: {
                backgroundColor: '#ff6b35',
                height: 3,
              },
            }}
          >
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                icon={tab.icon}
                label={tab.label}
                iconPosition={isMobile ? "top" : "start"}
                className={`font-medium text-gray-600 hover:text-orange-500 transition-colors ${
                  tabValue === index ? 'text-orange-600' : ''
                }`}
                sx={{
                  '&.Mui-selected': {
                    color: '#ff6b35',
                  },
                  minHeight: isMobile ? 72 : 48,
                }}
                {...a11yProps(index)}
              />
            ))}
          </Tabs>
        </Box>

        {/* Tab Content */}
        <Box className="p-6">
          {tabs.map((tab, index) => (
            <TabPanel key={index} value={tabValue} index={index}>
              {tab.component}
            </TabPanel>
          ))}
        </Box>
      </Paper>

      {/* Post Form Drawer */}
      <PostFormDrawer
        open={postFormOpen}
        onClose={handleClosePostForm}
        editPost={editPost}
      />
    </Container>
  );
}