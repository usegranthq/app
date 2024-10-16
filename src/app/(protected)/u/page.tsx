import { redirect } from 'next/navigation';

export default async function UPage() {
  // fetch projects. check if there is last project set in cookie. if so, redirect to that project.
  // else redirect to first project in the list.
  redirect('/u/projects');
}
