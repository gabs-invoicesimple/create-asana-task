import * as asana from 'asana'
import * as core from '@actions/core'
import dotenv from 'dotenv'

dotenv.config()

async function run(): Promise<void> {
  try {
    const {ACCESS_TOKEN, WORKSPACE_ID, PROJECT_ID} = process.env

    const accessToken = core.getInput('access_token') || ACCESS_TOKEN || ''
    const name = core.getInput('task_name') || 'New task'
    const workspaceId = core.getInput('workspace_id') || WORKSPACE_ID || ''
    const projectId = core.getInput('project_id') || PROJECT_ID || ''

    const client = asana.Client.create().useAccessToken(accessToken)

    core.debug(new Date().toTimeString())

    const task = await client.tasks.createInWorkspace(workspaceId, {name})

    core.debug(JSON.stringify(task, null, 2))

    const taskId = task.gid

    const addProjectResult = await client.tasks.addProject(taskId, {
      project: projectId
    })

    core.debug(JSON.stringify(addProjectResult, null, 2))

    core.setOutput('result', 'Completed!')
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
