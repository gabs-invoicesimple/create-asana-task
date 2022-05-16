import * as asana from 'asana'
import * as core from '@actions/core'
import dotenv from 'dotenv'

dotenv.config()

function setupClient(accessToken: string): asana.Client {
  return asana.Client.create().useAccessToken(accessToken)
}

async function createTask(
  client: asana.Client,
  workspaceId: string,
  name: string,
  projectId: string,
  description = ''
): Promise<asana.resources.Tasks.Type> {
  let task: asana.resources.Tasks.Type
  try {
    task = await client.tasks.createInWorkspace(workspaceId, {
      name,
      notes: description
    })
  } catch ({message}) {
    throw new Error(`Error creating Asana task: ${message}`)
  }

  try {
    await client.tasks.addProject(task.gid, {
      project: projectId
    })

    return task
  } catch ({message}) {
    throw new Error(`Error adding Asana task to project: ${message}`)
  }
}

async function run(): Promise<void> {
  try {
    const {ACCESS_TOKEN, WORKSPACE_ID, PROJECT_ID} = process.env

    const accessToken = core.getInput('access_token') || ACCESS_TOKEN || ''
    const name = core.getInput('task_name') || 'New task'
    const description = core.getInput('task_description') || ''
    const workspaceId = core.getInput('workspace_id') || WORKSPACE_ID || ''
    const projectId = core.getInput('project_id') || PROJECT_ID || ''

    const client = setupClient(accessToken)

    const task = await createTask(
      client,
      workspaceId,
      name,
      projectId,
      description
    )

    core.setOutput('task_id', task.gid)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
