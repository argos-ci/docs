---
description: Connect Argos to GitLab for visual testing, baseline selection, and direct feedback on your merge requests.
---

# GitLab integration

Connect Argos to GitLab to get commit statuses on your merge requests and accurate baseline selection from your commit history.

Argos reads commit history to select the correct [baseline build](../platform-fundamentals/baseline-build.md) and reports statuses back to GitLab. The integration also lets you sign in with GitLab and import your GitLab repositories.

### Connect a GitLab repository

Argos communicates with GitLab through a Personal Access Token, acting as a dedicated bot user on your merge requests.

{% stepper %}
{% step %}
#### Generate a Personal Access Token in GitLab

1. Go to [GitLab tokens settings](https://gitlab.com/-/profile/personal_access_tokens?name=argos2\&scopes=api,read_user).
2. Select **Add new token**.
3. Set an expiration date 12 months ahead (the maximum allowed).
4. Select **Create personal access token** and copy the generated token.

![Generate a Personal Access Token in GitLab](<../../.gitbook/assets/gitlab create token 01eecee687ee76bd683c82d45c88df99.png>)

{% hint style="info" %}
You can also use a [Project Access Token](https://docs.gitlab.com/ee/user/project/settings/project_access_tokens.html) if you want to restrict access to a single project. If you choose this option, be sure to set the role of the token to **Developer**.
{% endhint %}
{% endstep %}

{% step %}
#### Configure the token in Argos

1. From the dashboard, select your team or your personal account from the scope selector.
2. Select the **Settings** tab and go to the **Integrations** section.
3. Scroll to the **GitLab** section.
4. Enter the generated token and select **Save**.

![Configure GitLab in Argos](<../../.gitbook/assets/gitlab configuration argos 6715b7d493508d93af13bd1d4cb58563.png>)
{% endstep %}

{% step %}
#### Link a GitLab project to Argos

1. From the dashboard, select your team or your personal account from the scope selector.
2. Select the **Projects** tab.
3. Select **Create a new Project** at the top right.
4. Select **Continue with GitLab**.
5. Pick your GitLab organization and the desired repository. The new project appears in your projects list.

![Configure GitLab in Argos](<../../.gitbook/assets/argos create new project ab30905e08e499062fcc221cdb79f779.png>)
{% endstep %}
{% endstepper %}

### Connect an existing Argos project to GitLab

To link a GitLab repository to a project that already exists in Argos, go to **Project Settings → Connect Git Repository** and select the repository. The [token](#connect-a-gitlab-repository) must be configured first.

### GitLab Self-Managed

GitLab Self-Managed deployments are supported on the Argos Enterprise plan. These setups often require tailored configuration alongside SAML SSO and other enterprise features. To discuss enabling GitLab Self-Managed, [contact sales](https://argos-ci.com/contact).
