# Task Manager Pro

A modern, feature-rich task management application built with React and Vite. This application provides an intuitive interface for managing your daily tasks with advanced features like search, filtering, statistics, and theme customization.

## 🚀 Features

- **Task Management**: Create, edit, delete, and mark tasks as complete
- **Advanced Search**: Real-time search functionality to find tasks quickly
- **Smart Filtering**: Filter tasks by status, priority, or category
- **Task Statistics**: Visual dashboard showing task completion metrics
- **Theme Toggle**: Dark/Light mode support for better user experience
- **Notification System**: Real-time notifications for task updates
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Data Persistence**: Local storage integration for saving tasks

## 🛠️ Technologies Used

- **React 18** - Modern JavaScript library for building user interfaces
- **Vite** - Fast build tool and development server
- **CSS3** - Custom styling with modern CSS features
- **Local Storage API** - Client-side data persistence

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/Reddy076/Task-manager.git
cd Task-manager
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

## 🏗️ Build for Production

To create a production build:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## 📁 Project Structure

```
task-manager/
├── src/
│   ├── components/
│   │   ├── NotificationSystem.jsx
│   │   ├── TaskFilter.jsx
│   │   ├── TaskForm.jsx
│   │   ├── TaskItem.jsx
│   │   ├── TaskList.jsx
│   │   ├── TaskSearch.jsx
│   │   ├── TaskStats.jsx
│   │   └── ThemeToggle.jsx
│   ├── services/
│   │   └── taskAPI.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js
```

## 🎯 Usage

### Adding Tasks
1. Use the task form to create new tasks
2. Set priority levels and categories
3. Add descriptions and due dates

### Managing Tasks
- Click on tasks to mark them as complete
- Use the search bar to find specific tasks
- Apply filters to view tasks by status or category
- View statistics on your task completion progress

### Customization
- Toggle between dark and light themes using the theme switcher
- Organize tasks with custom categories and priorities

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🚀 Deployment

This project is ready for deployment on platforms like:
- Vercel
- Netlify
- GitHub Pages

Simply connect your GitHub repository to your preferred platform for automatic deployments.

## 📞 Support

If you have any questions or need help with the project, please open an issue on GitHub.

---

Made with ❤️ using React and Vite