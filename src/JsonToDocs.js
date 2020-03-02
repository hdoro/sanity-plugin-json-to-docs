import React from 'react'
import client from 'part:@sanity/base/client'
import Button from 'part:@sanity/components/buttons/default'
import Textarea from 'part:@sanity/components/textareas/default'
import FormField from 'part:@sanity/components/formfields/default'

import { SaveIcon } from './icons'

export default () => {
  const [rawJson, setRaw] = React.useState('')
  const [message, setMessage] = React.useState(undefined)
  const [isLoading, setLoading] = React.useState(false)

  async function saveDocs() {
    setMessage(undefined)
    setLoading(true)
    let resultMsg = {
      ok: true,
      text: 'Documents created!'
    }
    try {
      const parsed = JSON.parse(rawJson)
      let promises = []
      if (Array.isArray(parsed)) {
        resultMsg.text = `All ${parsed.length} documents were created!`
        for (const doc of parsed) {
          promises.push(
            new Promise((res, rej) => {
              client
                .create(doc)
                .then(res)
                .catch(rej)
            })
          )
        }
      } else if (typeof parsed === 'object') {
        resultMsg.text = 'Document was created!'
        promises.push(
          new Promise((res, rej) => {
            client
              .create(parsed)
              .then(res)
              .catch(rej)
          })
        )
      } else {
        resultMsg = {
          ok: false,
          text: "Can't add a value that isn't an array or object!"
        }
      }
      let createdDocuments = []
      let failedPromises = []
      await Promise.allSettled(promises).then(results => {
        for (const result of results) {
          console.log(result)
          if (result.status !== 'fulfilled') {
            resultMsg = {
              ok: false,
              text: "Some documents couldn't be saved"
            }
            failedPromises.push(result)
          } else {
            createdDocuments.push(result.value)
          }
        }
      })
      resultMsg.docs = createdDocuments
      resultMsg.failed = failedPromises
    } catch (error) {
      console.error(error)
      resultMsg = {
        ok: false,
        text: typeof error === 'object' ? JSON.stringify(error, null, 2) : error
      }
    }
    setLoading(false)
    setMessage(resultMsg)
    if (resultMsg.ok) {
      setRaw('')
    }
  }
  return (
    <main
      style={{
        maxWidth: '1200px',
        margin: '5vh auto'
      }}
    >
      <h1>Save documents from JSON</h1>
      {message && (
        <pre>
          <strong
            style={{
              color: message.ok ? 'green' : 'red'
            }}
          >
            {message.ok ? 'Success' : 'Error'}:
          </strong>
          {message.text}
        </pre>
      )}
      {message && (message.docs || message.failed) ? (
        <>
          {message.ok ? (
            <>
              <h2>The created documents:</h2>
              <pre
                style={{
                  maxHeight: '80vh',
                  overflow: 'auto',
                  background: 'white',
                  padding: '1em'
                }}
              >
                {JSON.stringify(message.docs, null, 2)}
              </pre>
              <Button
                color="success"
                onClick={() => setMessage(undefined)}
                title="Send new documents"
              >
                Send new documents
              </Button>
            </>
          ) : (
            <>
              <h2>Failed promises:</h2>
              <pre
                style={{
                  maxHeight: '80vh',
                  overflow: 'auto',
                  background: 'white',
                  padding: '1em'
                }}
              >
                {JSON.stringify(message.docs, null, 2)}
              </pre>
              <Button
                onClick={() => setMessage(undefined)}
                title="Try sending them again"
              >
                Try sending them again (copy the objects first)
              </Button>
            </>
          )}
        </>
      ) : (
        <form onSubmit={saveDocs}>
          <FormField label="Your JSON document">
            <Textarea
              value={rawJson}
              onInput={e => setRaw(e.target.value)}
              isClearable={true}
              disabled={isLoading}
              rows={15}
            ></Textarea>
          </FormField>
          <div style={{ marginTop: '1.5em' }}>
            <Button
              color="success"
              onClick={saveDocs}
              icon={SaveIcon}
              title="Create documents"
              disabled={isLoading}
              loading={isLoading}
            >
              Create documents
            </Button>
          </div>
        </form>
      )}
    </main>
  )
}
