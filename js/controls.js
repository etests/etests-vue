export default {
  institute: [
    {
      name: "Tests",
      color: "hot",
      icon: "mdi-file-document",
      cards: [
        {
          component: () => import("@/components/institute/Tests"),
          cols: {
            sm: 12,
            md: 8,
          },
        },
      ],
    },
    {
      name: "Test Series",
      color: "cool",
      icon: "mdi-book-minus",
      cards: [
        {
          component: () => import("@/components/institute/TestSeries"),
          cols: {
            sm: 12,
            md: 8,
          },
        },
      ],
    },
    {
      name: "Online Class",
      color: "error",
      icon: "mdi-video",
      institute: true,
      cards: [
        {
          component: () => import("@/components/institute/Lectures"),
          cols: {
            sm: 12,
            md: 12,
          },
        },
      ],
    },
    {
      name: "Assignments",
      color: "warning",
      icon: "mdi-paperclip",
      institute: true,
      cards: [
        {
          component: () => import("@/components/institute/Assignments"),
          cols: {
            sm: 12,
            md: 12,
          },
        },
      ],
    },
    {
      name: "Students",
      color: "warm",
      icon: "mdi-account-multiple",
      cards: [
        {
          component: () => import("@/components/institute/Students"),
          cols: {
            sm: 12,
            md: 8,
          },
        },
      ],
    },
    {
      name: "Transactions",
      color: "chill",
      icon: "mdi-currency-inr",
      cards: [
        {
          component: () => import("@/components/institute/Transactions"),
          cols: {
            sm: 12,
            md: 12,
          },
        },
      ],
    },
    {
      name: "Profile",
      color: "plume",
      icon: "mdi-account-circle",
      cards: [
        {
          component: () => import("@/components/institute/Profile"),
          cols: {
            sm: 12,
            md: 12,
          },
        },
      ],
    },
  ],

  student: [
    {
      name: "Tests",
      color: "hot",
      icon: "mdi-file-document",
      cards: [
        {
          component: () => import("@/components/student/Tests"),
          cols: {
            sm: 12,
            md: 8,
          },
        },
      ],
    },
    {
      name: "Free Tests",
      color: "chill",
      icon: "mdi-currency-usd-off",
      cards: [
        {
          component: () => import("@/components/student/FreeTests"),
          cols: {
            sm: 12,
            md: 8,
          },
        },
      ],
    },
    {
      name: "My Test Series",
      color: "cool",
      icon: "mdi-book-minus",
      cards: [
        {
          component: () => import("@/components/student/TestSeries"),
          cols: {
            sm: 12,
            md: 8,
          },
        },
      ],
    },
    {
      name: "Online Class",
      color: "error",
      icon: "mdi-video",
      institute: true,
      cards: [
        {
          component: () => import("@/components/institute/Lectures"),
          cols: {
            sm: 12,
            md: 12,
          },
        },
      ],
    },
    {
      name: "Assignments",
      color: "warning",
      icon: "mdi-paperclip",
      institute: true,
      cards: [
        {
          component: () => import("@/components/institute/Assignments"),
          cols: {
            sm: 12,
            md: 12,
          },
        },
      ],
    },
    {
      name: "Report",
      color: "warm",
      icon: "mdi-chart-line",
      cards: [
        {
          component: () => import("@/components/student/Report"),
          cols: {
            sm: 12,
            md: 12,
          },
        },
      ],
    },
    {
      name: "Profile",
      color: "plume",
      icon: "mdi-account-circle",
      cards: [
        {
          component: () => import("@/components/student/Profile"),
          cols: {
            sm: 12,
            md: 12,
          },
        },
      ],
    },
  ],

  staff: [
    {
      name: "Tests",
      icon: "mdi-file-document",
      color: "hot",
      cards: [
        {
          component: () => import("@/components/staff/Tests"),
          cols: {
            sm: 12,
            md: 8,
          },
        },
      ],
    },
    {
      name: "Question Bank",
      icon: "mdi-book-multiple",
      color: "chill",
      link: { path: "/questionbank" },
      cards: [],
    },
    {
      name: "Annotate",
      icon: "mdi-pencil-box-outline",
      color: "warm",
      link: { path: "/annotate" },
      cards: [],
    },

    {
      name: "Profile",
      color: "plume",
      icon: "mdi-account-circle",
      cards: [
        {
          component: () => import("@/components/staff/Profile"),
          cols: {
            sm: 12,
            md: 12,
          },
        },
      ],
    },
  ],
}
