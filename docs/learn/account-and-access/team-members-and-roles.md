---
description: >-
  Invite team members and assign team and project roles to control permissions
  with role-based access control.
---

# Team members & roles

Teams are made up of members, and each member has a role. Roles define what a member can and cannot do within a team on Argos — assign them so everyone has the right permissions as your team grows.

Argos distinguishes two groups of roles: **team-level roles** apply to the entire team and all its projects, while **project-level roles** are confined to individual projects.

![Team and project roles relationship diagram](<../../.gitbook/assets/permissions diagram 634397797bd522b3c4f79256e500f104.png>)

### Roles at a glance

| Role                                              | Scope   | Availability       |
| ------------------------------------------------- | ------- | ------------------ |
| [Owner](#owner-role)                              | Team    | Pro and Enterprise |
| [Member](#member-role)                            | Team    | Pro and Enterprise |
| [Contributor](#contributor-role)                  | Team    | Enterprise         |
| [Project Administrator](#project-administrator)   | Project | Enterprise         |
| [Project Reviewer](#project-reviewer)             | Project | Enterprise         |
| [Project Viewer](#project-viewer)                 | Project | Enterprise         |

Only contributors can have configurable project roles — Owners and Members always have access to every project in the team.

### Team-level roles

Team-level roles apply to all projects within the team.

#### Owner role

The Owner role is the highest level of authority within a team, with full access and control over all team and project settings.

**Key responsibilities**

* Oversee and manage all team resources and projects.
* Modify team settings, including billing.
* Grant or revoke access to team projects and assign project roles.
* Access and modify all projects, including their settings.

**Access and permissions**

Owners have unrestricted access to all team functionality, can modify all settings, and change other members' roles. They inherently act as project administrators for every project in the team.

Teams can have more than one owner — for continuity, we recommend at least two. Role changes, including assigning and revoking roles, are exclusive to owners.

#### Member role

Members are the most common role in the team. They have access to all projects but not to team management settings.

**Key responsibilities**

* See and review builds.
* Access and modify all projects, including their settings.

**Access and permissions**

Members have full autonomy to review projects and edit project settings. They can't edit team settings or invite new users to the team — only owners can.

#### Contributor role

Contributors give you fine-grained access control at the project level. A contributor has **no access to any project unless explicitly assigned** a [project role](#project-level-roles) on it.

**Key responsibilities**

* Typically assigned to specific projects based on expertise and needs.
* Review builds and edit project settings, depending on their assigned [project role](#project-level-roles).

**Access and permissions**

On each project, a contributor can be granted the [Project Administrator](#project-administrator), [Project Reviewer](#project-reviewer), or [Project Viewer](#project-viewer) role — or none, which denies access to that project.

### Project-level roles

Project-level roles restrict a contributor's access to specific projects:

* [**Project Administrator**](#project-administrator): Reviews builds and manages all project settings.
* [**Project Reviewer**](#project-reviewer): Reviews builds.
* [**Project Viewer**](#project-viewer): Has read-only access to the project.

#### Project Administrator

Project administrators are the project-level counterparts of team owners and members.

**Key responsibilities**

* Review builds.
* Manage project settings.
* Add contributors to the project.

**Access and permissions**

Their authority doesn't extend across the team: project administrators are restricted to the projects they're assigned to.

#### Project Reviewer

Project reviewers mirror the review capabilities of team members, with a narrowed project focus.

**Key responsibilities**

* Review builds.

#### Project Viewer

Project viewers have read-only access to the project.

**Key responsibilities**

* View and inspect all builds and screenshots.

### Default project roles

When you set a default role on a project, all of your team's contributors automatically inherit that role when granted access to the project — keeping permissions consistent without per-person configuration.

To set a default role on a project:

1. Go to the project's **Settings** page.
2. Scroll to the **Access management** section.
3. Select **Set default contributor level**.
4. Select the desired default role (Viewer, Reviewer, or Admin).
5. Select **Save**.

Every contributor then accesses this project with the default role. You can still override it by assigning a custom role to individual contributors.
