import { Button } from './components/common/Button';
import { Input } from './components/common/Input';
import { Card } from './components/common/Card';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ✨ Perfumería Elegance
          </h1>
          <p className="text-gray-600">Tailwind CSS v4 funcionando correctamente</p>
        </div>

        {/* Card con botones */}
        <Card>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Componentes de UI</h2>
          <div className="flex flex-wrap gap-3 mb-6">
            <Button variant="primary">Primario</Button>
            <Button variant="secondary">Secundario</Button>
            <Button variant="danger">Peligro</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="primary" disabled>Deshabilitado</Button>
          </div>

          {/* Inputs */}
          <div className="space-y-4">
            <Input label="Email" type="email" placeholder="tu@email.com" />
            <Input label="Contraseña" type="password" placeholder="••••••••" />
            <Input
              label="Con Error"
              error="Este campo es obligatorio"
              placeholder="Input con error"
            />
          </div>
        </Card>

        {/* Grid de cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <h3 className="font-bold text-lg mb-2">Card 1</h3>
            <p className="text-gray-600">Contenido de ejemplo</p>
          </Card>
          <Card>
            <h3 className="font-bold text-lg mb-2">Card 2</h3>
            <p className="text-gray-600">Contenido de ejemplo</p>
          </Card>
          <Card>
            <h3 className="font-bold text-lg mb-2">Card 3</h3>
            <p className="text-gray-600">Contenido de ejemplo</p>
          </Card>
        </div>

      </div>
    </div>
  );
}

export default App;
