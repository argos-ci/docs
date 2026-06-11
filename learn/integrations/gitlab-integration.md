# GitLab Integration

Enhance your GitLab workflow with Argos for streamlined visual testing, direct feedback on merge requests, and easy GitLab repository access.

### Why Argos needs repository access

Argos reads commit history to select the correct [baseline build](../platform-fundamentals/baseline-build.md) and reports statuses back to GitLab. Connecting your repository ensures Argos can compare builds accurately and keep merge requests up to date.

### Advantages of GitLab Integration

* Log in effortlessly via GitLab
* Access to GitLab repositories
* Get Argos feedback on your pull requests.

### Connecting a GitLab Repository

By leveraging GitLab's Personal Access Token, Argos communicates via a dedicated GitLab Bot User. This setup ensures direct feedback on your pull requests.

{% stepper %}
{% step %}
#### Generate a Personal Access Token in GitLab

* Go to [GitLab tokens settings](https://gitlab.com/-/profile/personal_access_tokens?name=argos2\&scopes=api,read_user).
* Click "Add new token".
* Set an expiration date 12 months ahead (maximum allowed).
* Click "Create personal access token" and then copy the generated token.

![Generate a Personal Access Token in GitLab](<../../.gitbook/assets/gitlab create token 01eecee687ee76bd683c82d45c88df99.png>)

{% hint style="info" %}
You can also use a [Project Access Token](https://docs.gitlab.com/ee/user/project/settings/project_access_tokens.html) if you want to restrict access to a single project. If you choose this option, be sure to use set the role of the token as **developer**.
{% endhint %}
{% endstep %}

{% step %}
#### Configure the Generated Token in Argos

1. From the dashboard, select your team or your personal account from the scope selector
2. Select the **Settings** tab and go to the **Integrations** section
3. Scroll to **GitLab** section
4. Enter the generated token and click **Save**

![Configure GitLab in Argos](<../../.gitbook/assets/gitlab configuration argos 6715b7d493508d93af13bd1d4cb58563.png>)
{% endstep %}

{% step %}
#### Link GitLab Project to Argos

1. From the dashboard, select your team or your personal account from the scope selector
2. Select the **Projects** tab
3. Click on **Create a new Project** at the top right
4. Select **Continue with GitLab**
5. Pick your GitLab organization and the desired repository, the new project should appear in your projects list

![Configure GitLab in Argos](<../../.gitbook/assets/argos create new project ab30905e08e499062fcc221cdb79f779.png>)
{% endstep %}
{% endstepper %}

### Connecting a Argos project to a GitLab Repository

First, ensure the [GitLab Personal Access Token has been configured correctly](gitlab-integration.md#connecting-a-gitlab-repository).

In Argos, navigate to "Project Settings" → "Connect Git Repository" and select the desired GitLab repository for association.

### GitLab Self-Managed

GitLab Self-Managed deployments are supported on the Argos Enterprise plan. These setups often require tailored configuration alongside SAML SSO and other enterprise features. To discuss enabling GitLab Self-Managed, [contact sales](mailto:contact@argos-ci.com).
