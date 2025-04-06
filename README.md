# MediConnect

This is the client for the medical app we developed for the Collective Project class. To run it, simply clone the repository, and run 

``` bash
npm install
npm run dev
```

MediConnect is a web application that helps patients easily connect with their doctors.

How? **Appointments, shared documents, chatting and more...**

### Patients
MediConnect helps patients connect with their doctors and manage their own medical data.
In this app, they can upload their documents, book appointments with all the doctors registered on the platform and chat with them in real time, so that they are always up to date with what’s going on with their health

![image](https://github.com/user-attachments/assets/25fd690c-ddc9-47af-8a8d-057bfcf776fe)
<p style="text-align: center; font-style: italic">Patient's home screen WIP</p>

![image](https://github.com/user-attachments/assets/2569ea01-3fc2-4a14-8be4-61106575573a)
<p style="text-align: center; font-style: italic">Patient's details screen WIP</p>

### Doctors
With MediConnect, doctors can check up with their patients easier than ever.
Using the platform, they can talk with any of the patients, upload or even create medical files, stored in the platform and manage all of their appointments, everything in an easy to use dashboard

![image](https://github.com/user-attachments/assets/aa9f891e-95d0-4498-aaf4-2a1e3224d39d)
<p style="text-align: center; font-style: italic">Doctor's home screen WIP</p>

![image](https://github.com/user-attachments/assets/b8f681c4-1adb-494b-a425-872ebbb8ffc2)
<p style="text-align: center; font-style: italic">Patient''s screen in doctor's perspective WIP</p>

### Technology

MediConnect is a web application built with React and Vite, using Vercel’s shadcn/ui library to create a beautiful and easy to use interface, which users will find very friendly at every interaction.

For the backend, MediConnect uses a REST API built with .NET 9, using the Neon serverless Postgres platform to easily (and cheaply!) store all of the data in a PostgresSQL database.
