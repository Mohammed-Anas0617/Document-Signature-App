import DocumentList from './DocumentList'
import SignatureOverlay from './SignatureOverlay'

function App() {
    return (
        <div>
            <DocumentList />
            <SignatureOverlay docId={1} />
        </div>
    )
}
export default App