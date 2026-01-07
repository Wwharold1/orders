import { Dialog } from '@headlessui/react';
import clsx from 'clsx';
import Image from 'next/image';
import { FC, useState } from 'react';

interface Serie {
  codFondoSerie: string;
  descripFondoSerie: string;
}

interface ModalSelectSerieProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onSelect: (serieCodigo: string) => void;
  series: Serie[];
  inversionMinima?: { habitat: string; description: string };
  comisionUnificada?: { habitat: string; description: string };
}

export const ModalSelectSerie: FC<ModalSelectSerieProps> = ({
  isOpen,
  onClose,
  onConfirm,
  onSelect,
  series,
  inversionMinima,
  comisionUnificada,
}) => {
  const [selected, setSelected] = useState<string | null>(null);

  const isSelected = (key: string) => selected === key;

  return (
    <Dialog open={isOpen} onClose={onClose} className='relative z-50'>
      <div className='fixed inset-0 bg-black/30' />
      <div className='fixed inset-0 flex items-center justify-center p-4'>
        <Dialog.Panel className='max-h-[322px] w-full max-w-[656px] bg-white p-6 shadow-lg'>
          <div className='flex flex-col items-center space-y-4'>
            <div className='grid h-11 w-11 place-content-center rounded-full bg-primary-50'>
              <Image
                src='/icons/edit_note.svg'
                alt='Serie icon'
                width={24}
                height={24}
              />
            </div>

            <Dialog.Title className='text-[20px] font-bold text-[#001F45]'>
              Selecciona la serie en la que deseas invertir
            </Dialog.Title>
          </div>

          <div className='mt-6 flex flex-col space-y-4 md:flex-row md:space-x-6 md:space-y-0'>
            {series.map((serie) => {
              const isA = serie.codFondoSerie === '000';

              return (
                <div
                  key={serie.codFondoSerie}
                  onClick={() => setSelected(serie.codFondoSerie)}
                  className={clsx(
                    'flex-1 cursor-pointer rounded p-4 text-left text-[#001F45] transition-shadow duration-200',
                    isSelected(serie.codFondoSerie)
                      ? 'border border-[#0066cc]'
                      : 'border border-transparent shadow-[0_4px_10px_-2px_rgba(7,93,143,0.08),_-2px_6px_10px_-4px_rgba(7,93,143,0.08)]'
                  )}
                >
                  <h2 className='font-bold'>
                    {serie.descripFondoSerie.trim()}
                  </h2>
                  <p className='text-sm'>
                    Inversión mínima inicial:{' '}
                    {!isA
                      ? inversionMinima?.habitat
                      : inversionMinima?.description}
                  </p>
                  <p className='text-sm'>
                    Comisión unificada:{' '}
                    {!isA
                      ? comisionUnificada?.habitat
                      : comisionUnificada?.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className='mt-6 flex justify-center gap-4'>
            <button
              onClick={onClose}
              className='w-[240px] rounded-full border border-[#0066cc] px-6 py-2 font-semibold text-[#0066cc] hover:bg-[#f0f8ff]'
            >
              Cancelar
            </button>
            <button
              disabled={!selected}
              onClick={() => {
                if (selected) {
                  onSelect(selected);
                  onConfirm();
                }
              }}
              className='w-[240px] rounded-full border-2 border-[#0066cc] bg-[#0066cc] px-6 py-2 font-semibold text-white disabled:opacity-50'
            >
              Continuar
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
