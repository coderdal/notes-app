import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition, RadioGroup } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { notesApi } from '@/lib/api';
import toast from 'react-hot-toast';
import EmailInput from './EmailInput';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  noteId: string;
}

export default function ShareModal({ isOpen, onClose, noteId }: ShareModalProps) {
  const [shareType, setShareType] = useState<'public' | 'private'>('public');
  const [emails, setEmails] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [shareUrl, setShareUrl] = useState<string>('');
  const [originalConfig, setOriginalConfig] = useState<{
    shareType: 'public' | 'private' | null;
    shareUrl: string;
    emails: string[];
  } | null>(null);

  const fetchShareStatus = async () => {
    try {
      setIsFetching(true);
      const status = await notesApi.getShareStatus(noteId);
      
      if (status.share_type) {
        setShareType(status.share_type);
        const userEmails = status.shared_users?.map(user => user.email) || [];
        const shareUrl = status.public_id ? `${window.location.origin}/share/${status.public_id}` : '';
        
        setEmails(userEmails);
        setShareUrl(shareUrl);
        setOriginalConfig({
          shareType: status.share_type,
          shareUrl,
          emails: userEmails
        });
      } else {
        setOriginalConfig(null);
      }
    } catch (error) {
      console.error('Failed to fetch share status:', error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchShareStatus();
    }
  }, [isOpen, noteId]);

  const handleShareTypeChange = (newType: 'public' | 'private') => {
    setShareType(newType);
    
    // If switching back to original type, restore original configuration
    if (originalConfig && newType === originalConfig.shareType) {
      setShareUrl(originalConfig.shareUrl);
      setEmails(originalConfig.emails);
    } else {
      setShareUrl('');
      if (newType === 'private') {
        setEmails([]);
      }
    }
  };

  const handleShare = async () => {
    try {
      setIsLoading(true);
      const response = await notesApi.share(noteId, {
        shareType,
        userEmails: shareType === 'private' ? emails : undefined
      });
      
      if (response.share_url) {
        const fullShareUrl = `${window.location.origin}${response.share_url}`;
        setShareUrl(fullShareUrl);
        setOriginalConfig({
          shareType,
          shareUrl: fullShareUrl,
          emails: shareType === 'private' ? emails : []
        });
        
        const skippedEmails = response.skipped_emails || [];
        if (skippedEmails.length > 0) {
          toast.success(
            <div>
              <p>Note shared successfully</p>
              <p className="text-sm mt-1">
                Skipped non-existent users: {skippedEmails.join(', ')}
              </p>
            </div>
          );
        } else {
          toast.success('Note shared successfully');
        }
      }
    } catch (error) {
      console.error('Failed to share note:', error);
      toast.error('Failed to share note');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveShare = async () => {
    try {
      setIsLoading(true);
      await notesApi.removeShare(noteId);
      setShareUrl('');
      setEmails([]);
      setOriginalConfig(null);
      toast.success('Share removed successfully');
    } catch (error) {
      console.error('Failed to remove share:', error);
      toast.error('Failed to remove share');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success('Share URL copied to clipboard');
  };

  if (isFetching) {
    return (
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    );
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-gray-900">
                      Share Note
                    </Dialog.Title>
                    <div className="mt-4">
                      <RadioGroup value={shareType} onChange={handleShareTypeChange} className="mt-2">
                        <RadioGroup.Label className="text-sm font-medium text-gray-900">Sharing Options</RadioGroup.Label>
                        <div className="mt-2 space-y-4">
                          <RadioGroup.Option value="public" className={({ checked }) =>
                            `${checked ? 'border-indigo-600 ring-2 ring-indigo-600' : 'border-gray-300'}
                             relative block cursor-pointer rounded-lg border bg-white px-6 py-4 shadow-sm focus:outline-none sm:flex sm:justify-between`
                          }>
                            {({ checked }) => (
                              <>
                                <div className="flex items-center">
                                  <div className="text-sm">
                                    <RadioGroup.Label as="p" className="font-medium text-gray-900">
                                      Public Link
                                    </RadioGroup.Label>
                                    <RadioGroup.Description as="p" className="text-gray-500">
                                      Anyone with the link can view this note
                                    </RadioGroup.Description>
                                  </div>
                                </div>
                                <div className={`${checked ? 'border-indigo-600' : 'border-transparent'} absolute -inset-px rounded-lg border-2 pointer-events-none`} aria-hidden="true" />
                              </>
                            )}
                          </RadioGroup.Option>

                          <RadioGroup.Option value="private" className={({ checked }) =>
                            `${checked ? 'border-indigo-600 ring-2 ring-indigo-600' : 'border-gray-300'}
                             relative block cursor-pointer rounded-lg border bg-white px-6 py-4 shadow-sm focus:outline-none sm:flex sm:justify-between`
                          }>
                            {({ checked }) => (
                              <>
                                <div className="flex items-center">
                                  <div className="text-sm">
                                    <RadioGroup.Label as="p" className="font-medium text-gray-900">
                                      Private Share
                                    </RadioGroup.Label>
                                    <RadioGroup.Description as="p" className="text-gray-500">
                                      Share with specific people via email
                                    </RadioGroup.Description>
                                  </div>
                                </div>
                                <div className={`${checked ? 'border-indigo-600' : 'border-transparent'} absolute -inset-px rounded-lg border-2 pointer-events-none`} aria-hidden="true" />
                              </>
                            )}
                          </RadioGroup.Option>
                        </div>
                      </RadioGroup>

                      {shareType === 'private' && (
                        <div className="mt-6 space-y-4">
                          <div>
                            <label className="block text-sm font-medium leading-6 text-gray-900">
                              Email Addresses
                            </label>
                            <div className="mt-2">
                              <EmailInput
                                value={emails}
                                onChange={setEmails}
                                placeholder="Add email addresses..."
                              />
                            </div>
                            <p className="mt-2 text-sm text-gray-500">
                              Press Enter or comma to add email. You can also paste multiple email addresses.
                            </p>
                          </div>
                        </div>
                      )}

                      {shareUrl && (
                        <div className="mt-6">
                          <label className="block text-sm font-medium leading-6 text-gray-900">
                            Share URL
                          </label>
                          <div className="mt-2 flex rounded-lg shadow-sm">
                            <input
                              type="text"
                              readOnly
                              value={shareUrl}
                              className="block w-full rounded-l-lg border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                            />
                            <button
                              type="button"
                              onClick={copyToClipboard}
                              className="relative -ml-px inline-flex items-center rounded-r-lg border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                            >
                              Copy
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-6 sm:flex sm:flex-row-reverse gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 sm:ml-3 sm:w-auto"
                    onClick={handleShare}
                    disabled={isLoading || (shareType === 'private' && !emails.length)}
                  >
                    {isLoading ? 'Sharing...' : 'Share'}
                  </button>
                  {shareUrl && (
                    <button
                      type="button"
                      className="mt-3 inline-flex w-full justify-center rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:mt-0 sm:w-auto"
                      onClick={handleRemoveShare}
                      disabled={isLoading}
                    >
                      Remove Share
                    </button>
                  )}
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
} 